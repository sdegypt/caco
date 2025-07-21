const NotificationModel = require("../models/NotificationModel");
const jwt = require("jsonwebtoken");

class AdminJobProjectSettingsController {
  static async showJobProjectSettings(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/login");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const user = await NotificationModel.getUserById(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).send("غير مصرح لك");
      }

      const settings = await NotificationModel.getForumSettings();
      const exceptions = await NotificationModel.getForumExceptions();

      res.render("admin/job-project-settings", { 
        settings, 
        exceptions, 
        successMessage: null, 
        errorMessage: null 
      });
    } catch (error) {
      res.redirect("/login");
    }
  }

  static async updateJobProjectSettings(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/login");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const user = await NotificationModel.getUserById(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).send("غير مصرح لك");
      }

      const { daily_job_limit, daily_project_limit } = req.body;

      // التحقق من القيم المدخلة
      const jobLimit = daily_job_limit ? parseInt(daily_job_limit) : null;
      const projectLimit = daily_project_limit ? parseInt(daily_project_limit) : null;

      if (jobLimit !== null && (isNaN(jobLimit) || jobLimit < 0)) {
        throw new Error("الحد اليومي للوظائف يجب أن يكون رقمًا موجبًا");
      }
      if (projectLimit !== null && (isNaN(projectLimit) || projectLimit < 0)) {
        throw new Error("الحد اليومي للمشاريع يجب أن يكون رقمًا موجبًا");
      }

      await NotificationModel.updateForumSettings({
        daily_job_limit: jobLimit,
        daily_project_limit: projectLimit
      });

      const settings = await NotificationModel.getForumSettings();
      const exceptions = await NotificationModel.getForumExceptions();

      res.render("admin/job-project-settings", {
        settings,
        exceptions,
        successMessage: "تم حفظ التغييرات بنجاح",
        errorMessage: null
      });
    } catch (error) {
      res.render("admin/job-project-settings", {
        settings: await NotificationModel.getForumSettings(),
        exceptions: await NotificationModel.getForumExceptions(),
        successMessage: null,
        errorMessage: error.message || "حدث خطأ أثناء حفظ التغييرات"
      });
    }
  }

  static async addException(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ success: false, message: "تسجيل الدخول مطلوب" });

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const user = await NotificationModel.getUserById(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ success: false, message: "غير مصرح لك" });
      }

      const { email } = req.body;
      const targetUser = await NotificationModel.getUserByEmail(email);
      if (!targetUser) {
        return res.status(404).json({ success: false, message: "المستخدم غير موجود" });
      }

      await NotificationModel.addForumException(targetUser.id);
      res.json({ success: true, userId: targetUser.id });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "حدث خطأ أثناء إضافة الاستثناء" });
    }
  }

  static async removeException(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ success: false, message: "تسجيل الدخول مطلوب" });

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const user = await NotificationModel.getUserById(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ success: false, message: "غير مصرح لك" });
      }

      const { userId: targetUserId } = req.body;
      if (!targetUserId) {
        return res.status(400).json({ success: false, message: "معرف المستخدم مطلوب" });
      }

      await NotificationModel.removeForumException(targetUserId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "حدث خطأ أثناء إزالة الاستثناء" });
    }
  }

  static async updateException(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ success: false, message: "تسجيل الدخول مطلوب" });

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const user = await NotificationModel.getUserById(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ success: false, message: "غير مصرح لك" });
      }

      const { userId: targetUserId, daily_job_limit, daily_project_limit } = req.body;
      if (!targetUserId) {
        return res.status(400).json({ success: false, message: "معرف المستخدم مطلوب" });
      }

      const jobLimit = daily_job_limit ? parseInt(daily_job_limit) : null;
      const projectLimit = daily_project_limit ? parseInt(daily_project_limit) : null;

      if (jobLimit !== null && (isNaN(jobLimit) || jobLimit < 0)) {
        return res.status(400).json({ success: false, message: "الحد اليومي للوظائف يجب أن يكون رقمًا موجبًا" });
      }
      if (projectLimit !== null && (isNaN(projectLimit) || projectLimit < 0)) {
        return res.status(400).json({ success: false, message: "الحد اليومي للمشاريع يجب أن يكون رقمًا موجبًا" });
      }

      await NotificationModel.updateForumException(targetUserId, {
        daily_job_limit: jobLimit,
        daily_project_limit: projectLimit
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "حدث خطأ أثناء تحديث الاستثناء" });
    }
  }
}

module.exports = AdminJobProjectSettingsController;