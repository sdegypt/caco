const jwt = require("jsonwebtoken");
const db = require("../config/db");

async function verifyToken(req, res, next) {
  const token = req.cookies.token || req.headers["authorization"];

  if (!token) {
    if (req.xhr || (req.headers['content-type'] && req.headers['content-type'].includes('application/json'))) {
      return res.status(401).json({ success: false, message: "يرجى تسجيل الدخول أولاً." });
    }
    return res.redirect('/login?alert=login_required');
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    // جلب بيانات المستخدم من قاعدة البيانات
    db.query("SELECT * FROM users WHERE id = ?", [decoded.id], (err, results) => {
      if (err || !results || results.length === 0) {
        if (req.xhr || (req.headers['content-type'] && req.headers['content-type'].includes('application/json'))) {
          return res.status(403).json({ success: false, message: "المستخدم غير موجود أو حدث خطأ" });
        }
        return res.redirect('/login?alert=login_required');
      }
      const user = results[0];
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isAdmin: user.role === 'admin',
      };
      next();
    });
  } catch (error) {
    if (req.xhr || (req.headers['content-type'] && req.headers['content-type'].includes('application/json'))) {
      return res.status(403).json({ success: false, message: "رمز غير صالح أو منتهي الصلاحية" });
    }
    return res.redirect('/login?alert=login_required');
  }
}

module.exports = verifyToken;