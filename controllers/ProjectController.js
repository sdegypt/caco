const Project = require("../models/Project");
const MessagesProject = require("../models/MessagesProject");
const NotificationModel = require("../models/NotificationModel");

class ProjectController {
  static getCreateProject(req, res) {
    res.render("create_project", {
      errorMessage: null,
      successMessage: null,
      projectData: {}
    });
  }

  static async postCreateProject(req, res) {
    try {
      const userId = req.user.id;

      const canAddProject = await NotificationModel.canUserAddProject(userId);
      if (!canAddProject.canAddProject) {
        return res.status(403).render("create_project", {
          errorMessage: canAddProject.message,
          successMessage: null,
          projectData: req.body
        });
      }

      const { projectTitle, manualDescription, budget, duration } = req.body;

      if (!projectTitle || !manualDescription || !budget || !duration) {
        return res.status(400).render("create_project", {
          errorMessage: "يرجى ملء جميع الحقول المطلوبة",
          successMessage: null,
          projectData: req.body
        });
      }

      const budgetValue = parseFloat(budget);
      const durationValue = parseInt(duration, 10);
      if (isNaN(budgetValue) || budgetValue <= 0 || isNaN(durationValue) || durationValue <= 0) {
        return res.status(400).render("create_project", {
          errorMessage: "الميزانية ومدة التنفيذ يجب أن تكونا قيماً صحيحة وموجبة",
          successMessage: null,
          projectData: req.body
        });
      }

      const projectData = {
        title: projectTitle,
        description: manualDescription.trim(),
        budget: budgetValue,
        duration: durationValue,
        user_id: userId,
      };

      await Project.create(projectData);
      res.redirect("/projects");
    } catch (error) {
      res.status(500).render("create_project", {
        errorMessage: error.message || "حدث خطأ في الخادم أثناء إضافة المشروع",
        successMessage: null,
        projectData: req.body
      });
    }
  }

  static async getAllProjects(req, res) {
    try {
      const projects = await Project.findAll();
      res.render("projects", { 
        projects,
        errorMessage: null,
        successMessage: null
      });
    } catch (error) {
      res.status(500).render("projects", {
        projects: [],
        errorMessage: "حدث خطأ أثناء جلب المشاريع",
        successMessage: null
      });
    }
  }

  static async getProjectDetails(req, res) {
    try {
      const projectId = req.params.id;
      const project = await Project.getProjectById(projectId);
      if (!project) {
        return res.status(404).render("project-details", {
          project: null,
          errorMessage: "المشروع غير موجود",
          successMessage: null
        });
      }
      res.render("project-details", { 
        project,
        errorMessage: null,
        successMessage: null
      });
    } catch (error) {
      res.status(500).render("project-details", {
        project: null,
        errorMessage: "حدث خطأ أثناء جلب تفاصيل المشروع",
        successMessage: null
      });
    }
  }

  static async postApplyProject(req, res) {
    try {
      const { project_id, applicant_name, applicant_email, motivation } = req.body;
      const applicant_id = req.user.id;

      const project = await Project.findById(project_id);
      if (!project) {
        return res.status(404).json({ success: false, message: "المشروع غير موجود" });
      }

      const existingApplication = await Project.getApplicationByUserAndProject(applicant_id, project_id);
      if (existingApplication) {
        return res.status(400).json({ success: false, message: "لقد قمت بالفعل بإرسال طلب لهذا المشروع" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(applicant_email)) {
        return res.status(400).json({ success: false, message: "البريد الإلكتروني غير صالح" });
      }

      const applicationData = {
        project_id,
        applicant_name,
        applicant_email,
        motivation,
        applicant_id,
      };

      await Project.createApplication(applicationData);
      res.json({ success: true, message: "تم إرسال الطلب بنجاح!" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "حدث خطأ في الخادم" });
    }
  }

  static async getProjectRequests(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).render("project_requests", {
          requests: [],
          errorMessage: "غير مصرح لك بالوصول إلى هذه الصفحة",
          successMessage: null
        });
      }

      const requests = await Project.getProjectRequests(userId);
      res.render("project_requests", { 
        requests,
        errorMessage: null,
        successMessage: null
      });
    } catch (error) {
      res.status(500).render("project_requests", {
        requests: [],
        errorMessage: "حدث خطأ أثناء جلب طلبات المشروع",
        successMessage: null
      });
    }
  }

  static async acceptRequest(req, res) {
    try {
      const requestId = req.params.requestId;
      const ownerId = req.user.id;

      const request = await Project.getRequestById(requestId);
      if (!request) {
        return res.status(404).json({ success: false, message: "الطلب غير موجود" });
      }

      const project = await Project.findById(request.project_id);
      if (project.user_id !== ownerId) {
        return res.status(403).json({ success: false, message: "غير مصرح لك بقبول هذا الطلب" });
      }

      if (request.status !== "pending") {
        return res.status(400).json({ success: false, message: "لا يمكن قبول طلب تمت معالجته مسبقًا" });
      }

      await Project.updateRequestStatus(requestId, "accepted");

      const conversationData = {
        project_id: request.project_id,
        sender_id: ownerId,
        receiver_id: request.applicant_id,
        message: "تم قبول طلبك للانضمام إلى المشروع. يمكنك البدء في المحادثة الآن.",
        status: "accepted",
        conversation_id: requestId,
      };

      const conversation = await MessagesProject.create(conversationData);

      res.json({
        success: true,
        message: "تم قبول الطلب وفتح محادثة بنجاح",
        conversationId: conversation.insertId || requestId,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "حدث خطأ في الخادم" });
    }
  }

  static async rejectRequest(req, res) {
    try {
      const requestId = req.params.requestId;
      const ownerId = req.user.id;

      const request = await Project.getRequestById(requestId);
      if (!request) {
        return res.status(404).json({ success: false, message: "الطلب غير موجود" });
      }

      const project = await Project.findById(request.project_id);
      if (project.user_id !== ownerId) {
        return res.status(403).json({ success: false, message: "غير مصرح لك برفض هذا الطلب" });
      }

      if (request.status !== "pending") {
        return res.status(400).json({ success: false, message: "لا يمكن رفض طلب تمت معالجته مسبقًا" });
      }

      await Project.updateRequestStatus(requestId, "rejected");

      res.json({
        success: true,
        message: "تم رفض الطلب بنجاح",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "حدث خطأ في الخادم" });
    }
  }

  static async updateRequestStatus(req, res) {
    try {
      const requestId = req.params.requestId;
      const { status } = req.body;

      await Project.updateRequestStatus(requestId, status);

      res.json({ success: true, message: "تم تحديث حالة الطلب بنجاح" });
    } catch (error) {
      res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
    }
  }
}

module.exports = ProjectController;