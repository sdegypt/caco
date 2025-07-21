const express = require("express");
const multer = require("multer");
const ChatController = require("../controllers/chatController");

const router = express.Router();

// استخدام الذاكرة المؤقتة بدلاً من القرص لتجنب مشكلة نظام الملفات للقراءة فقط على Vercel
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // حد أقصى 5 ميجابايت
  }
});

// عرض صفحة الدردشة مع الصديق
router.get("/chat/:friendId", ChatController.getChatPage);

// جلب الرسائل الجديدة (للاستخدام مع polling)
router.get("/chat/getMessages", ChatController.getMessages);

// إرسال رسالة جديدة
router.post("/chat/sendMessage", upload.single("imagePath"), ChatController.sendMessage);

// حذف كل الرسائل
router.post("/messages/delete-all", ChatController.deleteAllMessages);

// حذف رسالة معينة
router.post("/chat/delete/:messageId", ChatController.deleteMessage); // Changed route to match client-side

// عرض صفحة الرسائل الواردة
router.get("/messages", ChatController.getMessagesPage);

// تحديث الصورة الرمزية
router.post("/updateAvatar", upload.single("avatar"), ChatController.updateAvatar);

// جلب تحديثات الصور الرمزية (للاستخدام مع polling)
router.get("/chat/getAvatarUpdates", ChatController.getAvatarUpdates);

// جلب عدد الرسائل غير المقروءة
router.get("/chat/unread-count", ChatController.getUnreadMessagesCount);

// تحديد جميع الرسائل كمقروءة
router.post("/chat/mark-all-as-read", ChatController.markAllAsRead);

module.exports = router;

