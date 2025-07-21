const express = require("express");
const AdminStatisticsController = require("../controllers/AdminStatisticsController");
const router = express.Router();

// عرض صفحة الإحصائيات
router.get("/statistics", AdminStatisticsController.showStatistics);

module.exports = router;