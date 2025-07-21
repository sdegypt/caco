const db = require("../config/db");
const jwt = require("jsonwebtoken");

class GlobalRoleModel {
  static async checkUserRole(token) {
    return new Promise((resolve, reject) => {
      if (!token) {
        return resolve({ isAdmin: false, userId: null });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, "your_jwt_secret");
      } catch (error) {
        return resolve({ isAdmin: false, userId: null });
      }

      const query = `
        SELECT u.id, u.role, r.name AS role_name
        FROM users u
        LEFT JOIN roles r ON u.role = r.name
        WHERE u.id = ?
      `;
      db.query(query, [decoded.id], (error, results) => {
        if (error) {
          return reject(error);
        }
        if (results.length === 0) {
          return resolve({ isAdmin: false, userId: null });
        }
        const user = results[0];
        resolve({
          isAdmin: user.role === 'admin' || user.role_name === 'admin',
          userId: user.id
        });
      });
    });
  }
}

module.exports = GlobalRoleModel;