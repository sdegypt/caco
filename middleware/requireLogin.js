// في ملف middleware/requireLogin.js
function requireLogin(req, res, next) {
  if (req.session && req.session.userId) {
    next(); // إذا كانت الجلسة تحتوي على userId، تابع الطلب
  } else {
    res.redirect("/login"); // إعادة التوجيه لصفحة تسجيل الدخول إذا لم يكن المستخدم مسجل دخول
  }
}

module.exports = requireLogin;
