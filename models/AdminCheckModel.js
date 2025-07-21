const db = require("../config/db");
const jwt = require("jsonwebtoken");

class AdminCheckModel {
  // التحقق من دور المستخدم مباشرة من جدول users
  static async isAdmin(token) {
    return new Promise((resolve, reject) => {
      if (!token) return resolve(false);

      try {
        const decoded = jwt.verify(token, "your_jwt_secret");
        const query = "SELECT role FROM users WHERE id = ?";
        db.query(query, [decoded.id], (error, results) => {
          if (error) return reject(error);
          if (results.length === 0) return resolve(false);
          resolve(results[0].role === 'admin');
        });
      } catch (error) {
        resolve(false); // في حالة انتهاء التوكن أو خطأ في التحقق
      }
    });
  }

  // جلب معرف المستخدم من التوكن
  static async getUserId(token) {
    return new Promise((resolve, reject) => {
      if (!token) return resolve(null);

      try {
        const decoded = jwt.verify(token, "your_jwt_secret");
        resolve(decoded.id);
      } catch (error) {
        resolve(null);
      }
    });
  }
}

module.exports = AdminCheckModel;