const MessagesProject = require("../models/MessagesProject");
const Project = require("../models/Project");

class MessagesProjectController {
  static async getMessages(req, res) {
    try {
      const conversationId = req.params.conversationId;
      const messages = await MessagesProject.findByConversationId(conversationId);

      res.json({ success: true, messages });
    } catch (error) {
      res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
    }
  }

  static async sendMessage(req, res) {
    try {
      const { conversationId, message } = req.body;

      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "غير مصادق، يرجى تسجيل الدخول" });
      }
      const senderId = req.user.id;

      if (!conversationId) {
        return res.status(400).json({
          success: false,
          message: "يرجى تحديد معرف المحادثة (conversationId) المرتبط بطلب الانضمام",
        });
      }

      let projectId, receiverId;

      // جلب المحادثة الحالية إن وجدت
      const existingConversation = await MessagesProject.findByConversationId(conversationId);

      if (!existingConversation || existingConversation.length === 0) {
        // إذا لم تكن المحادثة موجودة، جلب بيانات الطلب من project_applications
        const request = await Project.getRequestById(conversationId);
        if (!request) {
          return res.status(404).json({
            success: false,
            message: `لا يوجد طلب بمعرف ${conversationId} لربطه بالمحادثة`,
          });
        }

        projectId = request.project_id;
        receiverId = senderId === request.applicant_id ? request.user_id : request.applicant_id;
      } else {
        projectId = existingConversation[0].project_id;
        receiverId = existingConversation[0].receiver_id;
      }

      await MessagesProject.create({
        conversation_id: conversationId,
        sender_id: senderId,
        message,
        project_id: projectId,
        receiver_id: receiverId,
        status: "accepted",
      });

      res.json({
        success: true,
        message: "تم إرسال الرسالة بنجاح",
        conversationId: conversationId,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "حدث خطأ في الخادم", error: error.message });
    }
  }

  static async showConversation(req, res) {
    try {
      const conversationId = req.params.conversationId;

      // جلب المحادثة مع اسم المشروع
      const messages = await MessagesProject.findByConversationId(conversationId);

      if (!messages || messages.length === 0) {
        return res.status(404).send(`لا يوجد طلب أو محادثة بمعرف ${conversationId}`);
      }

      const projectName = messages[0].project_name || "مشروع غير معروف";

      res.render("messages_project", { conversationId, projectName });
    } catch (error) {
      res.status(500).send("حدث خطأ في الخادم");
    }
  }

  static async getOngoingChats(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).send("يرجى تسجيل الدخول أولاً");
      }
      const userId = req.user.id;

      const chats = await MessagesProject.getChatsByUser(userId);

      res.render("ongoing_chats", { chats });
    } catch (error) {
      res.status(500).send("حدث خطأ في الخادم");
    }
  }
}

module.exports = MessagesProjectController;