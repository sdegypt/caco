const NotificationModel = require("../models/NotificationModel");
const jwt = require("jsonwebtoken");

class AdminForumSettingsController {
  static async showForumSettings(req, res) {
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

      res.render("admin/forum-settings", { 
        settings, 
        exceptions, 
        successMessage: null, 
        errorMessage: null 
      });
    } catch (error) {
      logger.error("خطأ في عرض صفحة إعدادات المنتدى:", error);
      res.redirect("/login");
    }
  }

  static async updateForumSettings(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/login");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const user = await NotificationModel.getUserById(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).send("غير مصرح لك");
      }

      const {
        daily_post_limit,
        daily_comment_limit,
        daily_ad_limit,
        max_images_per_post,
        enable_likes,
        ad_expiry_days
      } = req.body;

      await NotificationModel.updateForumSettings({
        daily_post_limit,
        daily_comment_limit,
        daily_ad_limit,
        max_images_per_post,
        enable_likes: enable_likes === 'on' ? '1' : '0',
        ad_expiry_days
      });

      const settings = await NotificationModel.getForumSettings();
      const exceptions = await NotificationModel.getForumExceptions();

      res.render("admin/forum-settings", {
        settings,
        exceptions,
        successMessage: "تم حفظ التغييرات بنجاح",
        errorMessage: null
      });
    } catch (error) {
      logger.error("خطأ في تحديث إعدادات المنتدى:", error);
      res.render("admin/forum-settings", {
        settings: await NotificationModel.getForumSettings(),
        exceptions: await NotificationModel.getForumExceptions(),
        successMessage: null,
        errorMessage: "حدث خطأ أثناء حفظ التغييرات"
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
      logger.error("خطأ في إضافة استثناء:", error);
      res.status(500).json({ success: false, message: "حدث خطأ أثناء إضافة الاستثناء" });
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
      await NotificationModel.removeForumException(targetUserId);
      res.json({ success: true });
    } catch (error) {
      logger.error("خطأ في إزالة استثناء:", error);
      res.status(500).json({ success: false, message: "حدث خطأ أثناء إزالة الاستثناء" });
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

      const { userId: targetUserId, daily_post_limit, daily_comment_limit, daily_ad_limit, daily_like_limit } = req.body;
      await NotificationModel.updateForumException(targetUserId, {
        daily_post_limit: daily_post_limit ? parseInt(daily_post_limit) : null,
        daily_comment_limit: daily_comment_limit ? parseInt(daily_comment_limit) : null,
        daily_ad_limit: daily_ad_limit ? parseInt(daily_ad_limit) : null,
        daily_like_limit: daily_like_limit ? parseInt(daily_like_limit) : null
      });
      res.json({ success: true });
    } catch (error) {
      logger.error("خطأ في تحديث استثناء:", error);
      res.status(500).json({ success: false, message: "حدث خطأ أثناء تحديث الاستثناء" });
    }
  }
}

module.exports = AdminForumSettingsController;