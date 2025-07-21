const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.session.userId) {
    // إذا كان userId موجودًا في الجلسة، يسمح للمستخدم بمتابعة الطلب
    return next();
  }
  // محاولة التحقق من التوكن في الكوكيز
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, "your_jwt_secret");
      req.session.userId = decoded.id; // تعيين userId في الجلسة
      return next();
    } catch (err) {
      // إذا كان التوكن غير صالح أو منتهي الصلاحية
      return res.redirect("/login");
    }
  }
  // إذا لم يوجد userId ولا توكن صالح
  res.redirect("/login");
};
