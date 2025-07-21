const NotificationModel = require("../models/NotificationModel");
const jwt = require("jsonwebtoken");

class AdminDashboardController {
  static async showDashboard(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/login");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const user = await NotificationModel.getUserById(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).send("غير مصرح لك");
      }

      const totalUsers = await NotificationModel.getTotalUsers();
      const totalAds = await NotificationModel.getTotalAds();
      const totalPosts = await NotificationModel.getTotalPosts();
      const totalProjects = await NotificationModel.getTotalProjects();
      const totalJobs = await NotificationModel.getTotalJobs();

      res.render("admin/dashboard", { 
        totalUsers,
        totalAds,
        totalPosts,
        totalProjects,
        totalJobs
      });
    } catch (error) {
      logger.error("Error showing admin dashboard:", error);
      res.redirect("/login");
    }
  }
}

module.exports = AdminDashboardController;