const NotificationModel = require("../models/NotificationModel");
const jwt = require("jsonwebtoken");

class AdminStatisticsController {
  static async showStatistics(req, res) {
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
      const activeUsersNow = await NotificationModel.getActiveUsersNow();
      const newUsersToday = await NotificationModel.getNewUsersToday();
      const newUsersThisMonth = await NotificationModel.getNewUsersThisMonth();
      const blockedUsers = await NotificationModel.getBlockedUsers();
      const usersByMonthData = await NotificationModel.getUsersByMonth();
      const usersByGender = await NotificationModel.getUsersByGender();
      const usersByCountry = await NotificationModel.getUsersByCountry();
      const usersByAge = await NotificationModel.getUsersByAge();

      console.log("Users by Month Data:", usersByMonthData);
      console.log("Users by Gender Data:", usersByGender);
      console.log("Users by Country Data:", usersByCountry);
      console.log("Users by Age Data:", usersByAge);

      const months = usersByMonthData.map(data => data.month) || [];
      const usersPerMonth = usersByMonthData.map(data => data.count) || [];

      res.render("admin/statistics", {
        totalUsers: totalUsers || 0,
        activeUsersNow: activeUsersNow || 0,
        newUsersToday: newUsersToday || 0,
        newUsersThisMonth: newUsersThisMonth || 0,
        blockedUsers: blockedUsers || 0,
        months: months,
        usersPerMonth: usersPerMonth,
        genderData: usersByGender,
        countryData: usersByCountry,
        ageData: usersByAge
      });
    } catch (error) {
      logger.error("Error showing statistics page:", error);
      res.redirect("/login");
    }
  }
}

module.exports = AdminStatisticsController;