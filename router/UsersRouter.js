const express = require("express");
const router = express.Router();
const UsersControllers = require("../controllers/usersControllers");
const { uploadAvatar } = require('../config/multerConfig');
const AuthResetController = require('../controllers/AuthResetController');

// مسار تسجيل الحساب الجديد بدون رفع صورة
router.post("/signup", UsersControllers.signUpControllers);

// زر تعديل المعلومات الشخصية
router.post("/edit-profile", UsersControllers.updateProfileAjaxControllers);

// مسارات عرض الصفحات
router.get("/", (req, res) => res.render("login"));
router.get("/signup", (req, res) => res.render("signup"));
router.get("/login", (req, res) => res.render("login"));

// معالجة تسجيل الدخول
router.post("/login", UsersControllers.loginControllers);

// تسجيل الخروج
router.post("/logout", UsersControllers.logoutControllers);

// نسيت كلمة المرور
router.get("/forgotPassword", (req, res) => res.render("forgotPassword"));
router.post("/forgotPassword", UsersControllers.forgotPasswordControllers);

// إعادة إرسال OTP (قديم) - تم الحذف
// router.post("/resend-otp", ...);

// إعادة تعيين كلمة المرور
router.get("/resetPassword", (req, res) => {
  const { token } = req.query;
  res.render("resetPassword", { token });
});
router.post("/resetPassword", UsersControllers.resetPasswordControllers);

// مسارات استرجاع كلمة المرور الحديثة (OTP)
router.post('/auth/request-reset', AuthResetController.requestReset);
router.post('/auth/reset-password', AuthResetController.resetPassword);

module.exports = router;