const express = require("express");
const router = express.Router();
const RoleCheckController = require("../controllers/RoleCheckController");

// تطبيق Middleware للتحقق من الدور مباشرة من جدول users
router.use(RoleCheckController.checkRole);

// مسار /forum كمثال رئيسي
router.get("/forum", (req, res) => {
  res.render("forum", {
    userId: res.locals.userId,
    isAdmin: res.locals.isAdmin,
    unreadCount: 0, // قيمة افتراضية، يمكنك استبدالها بمنطق الإشعارات
    unreadMessagesCount: 0 // قيمة افتراضية، يمكنك استبدالها بمنطق الرسائل
  });
});

// مسار /admin/dashboard (اختياري)
router.get("/admin/dashboard", (req, res) => {
  if (!res.locals.isAdmin) {
    return res.redirect("/forum");
  }
  res.render("admin/dashboard", {
    userId: res.locals.userId,
    isAdmin: res.locals.isAdmin
  });
});

module.exports = router;