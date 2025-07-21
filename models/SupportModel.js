const db = require("../config/db");
const jwt = require("jsonwebtoken");

class SupportModel {
  // التحقق من دور المستخدم بناءً على التوكن
  static async getUserRole(token) {
    return new Promise((resolve, reject) => {
      if (!token) return resolve(null);

      try {
        const decoded = jwt.verify(token, "your_jwt_secret");
        const query = "SELECT role FROM users WHERE id = ?";
        db.query(query, [decoded.id], (error, results) => {
          if (error) return reject(error);
          if (results.length === 0) return resolve(null);
          resolve(results[0].role);
        });
      } catch (error) {
        resolve(null); // في حالة انتهاء التوكن أو خطأ في التحقق
      }
    });
  }
}

module.exports = SupportModel;