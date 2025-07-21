const express = require("express");
const router = express.Router();
const SupportController = require("../controllers/SupportController");

// تطبيق Middleware للتحقق من الدور
router.use(SupportController.checkSupportAccess);

// يمكنك إضافة مسارات إضافية هنا إذا لزم الأمر، لكننا سنعتمد على ال Middleware فقط الآن
router.get("/forum", (req, res) => {
  res.render("forum", {
    userId: res.locals.userId,
    isAdmin: res.locals.isAdmin,
    unreadCount: 0, // يمكنك استبدال هذا بمنطق الإشعارات الخاص بك
    unreadMessagesCount: 0 // يمكنك استبدال هذا بمنطق الرسائل الخاص بك
  });
});

module.exports = router;