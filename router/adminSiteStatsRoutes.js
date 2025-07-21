const express = require("express");
const AdminSiteStatsController = require("../controllers/AdminSiteStatsController");
const router = express.Router();

// عرض صفحة إحصائيات الموقع
router.get("/site-stats", AdminSiteStatsController.showSiteStats);

module.exports = router;