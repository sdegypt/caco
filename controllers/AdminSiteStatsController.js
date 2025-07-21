const NotificationModel = require("../models/NotificationModel");
const jwt = require("jsonwebtoken");

class AdminSiteStatsController {
  static async showSiteStats(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/login");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const user = await NotificationModel.getUserById(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).send("غير مصرح لك");
      }

      // إحصائيات الإعلانات
      const totalAds = await NotificationModel.getTotalAds();
      const recentAds = await NotificationModel.getRecentAdsCount();
      // إحصائيات المنتديات
      const totalPosts = await NotificationModel.getTotalPosts();
      const totalComments = await NotificationModel.getTotalComments();
      const totalLikes = await NotificationModel.getTotalLikes();
      // إحصائيات المشاريع
      const totalProjects = await NotificationModel.getTotalProjects();
      const totalProjectRequests = await NotificationModel.getTotalProjectRequests();
      const activeProjects = await NotificationModel.getActiveProjects();
      // إحصائيات الوظائف
      const totalJobs = await NotificationModel.getTotalJobs();
      const totalJobApplications = await NotificationModel.getTotalJobApplications();
      const recentJobs = await NotificationModel.getRecentJobs();

      res.render("admin/site-stats", {
        totalAds,
        recentAds,
        totalPosts,
        totalComments,
        totalLikes,
        totalProjects,
        totalProjectRequests,
        activeProjects,
        totalJobs,
        totalJobApplications,
        recentJobs
      });
    } catch (error) {
      logger.error("Error showing site stats page:", error);
      res.redirect("/login");
    }
  }
}

module.exports = AdminSiteStatsController;