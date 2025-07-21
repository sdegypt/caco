const express = require("express");
const multer = require("multer");
const NotificationController = require("../controllers/NotificationController");
const ChatController = require("../controllers/chatController"); // لاستخدام markAllAsRead
const router = express.Router();

// استخدام الذاكرة المؤقتة بدلاً من القرص لتجنب مشكلة نظام الملفات للقراءة فقط على Vercel
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // حد أقصى 5 ميجابايت
  }
});

// عرض صفحة الإشعارات
router.get("/notifications", NotificationController.showNotifications);

// جلب الإشعارات الجديدة
router.get("/notifications/get-new", NotificationController.getNewNotifications);

// تحديث حالة الإشعار إلى "تم العرض"
router.post("/notifications/:id/markAsViewed", NotificationController.markAsViewed);

// تحديد إشعار واحد كمقروء
router.post("/notifications/mark-as-read/:id", NotificationController.markAsViewed);

// حذف إشعار معين
router.post("/notifications/delete/:id", NotificationController.deleteNotification);

// حذف جميع الإشعارات
router.post("/notifications/delete-all", NotificationController.deleteAllNotifications);

// عرض صفحة إرسال إشعار من المسؤول
router.get("/admin/notify", NotificationController.showAdminNotifyPage);

// إرسال إشعار من المسؤول
router.post("/admin/notifications", upload.single("image"), NotificationController.sendAdminNotification);

// تحديد جميع الإشعارات كمقروءة
router.post("/notifications/mark-all-read", NotificationController.markAllNotificationsAsRead);

// تحديد جميع الرسائل كمقروءة (من ChatController)
router.post("/chat/mark-all-as-read", ChatController.markAllAsRead);

module.exports = router;

