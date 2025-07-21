const NotificationModel = require("../models/NotificationModel");
const jwt = require("jsonwebtoken");

class AdminUsersController {
  static async showUsers(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/login");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const adminUser = await NotificationModel.getUserById(userId);
      if (!adminUser || (adminUser.email !== "sedik@mail.com" && adminUser.role !== "admin")) {
        return res.status(403).send("غير مصرح لك");
      }

      const query = req.query.query || "";
      let users;
      if (query) {
        users = await NotificationModel.searchUsers(query);
      } else {
        users = await NotificationModel.getAllUsers();
      }

      res.render("admin/users", { users, query });
    } catch (error) {
      logger.error("Error showing users page:", error);
      res.redirect("/login");
    }
  }

  static async setAdmin(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/login");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const adminUser = await NotificationModel.getUserById(userId);
      if (!adminUser || (adminUser.email !== "sedik@mail.com" && adminUser.role !== "admin")) {
        return res.status(403).send("غير مصرح لك");
      }

      const targetUserId = req.params.id;
      await NotificationModel.setUserRole(targetUserId, "admin");
      res.redirect("/admin/users");
    } catch (error) {
      logger.error("Error setting user as admin:", error);
      res.redirect("/admin/users");
    }
  }

  static async toggleBlock(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/login");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const adminUser = await NotificationModel.getUserById(userId);
      if (!adminUser || (adminUser.email !== "sedik@mail.com" && adminUser.role !== "admin")) {
        return res.status(403).send("غير مصرح لك");
      }

      const targetUserId = req.params.id;
      const targetUser = await NotificationModel.getUserById(targetUserId);
      const newStatus = targetUser.is_active ? 0 : 1;
      await NotificationModel.toggleUserBlock(targetUserId, newStatus);
      res.redirect("/admin/users");
    } catch (error) {
      logger.error("Error toggling user block status:", error);
      res.redirect("/admin/users");
    }
  }
}

module.exports = AdminUsersController;