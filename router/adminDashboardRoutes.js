const express = require("express");
const AdminDashboardController = require("../controllers/AdminDashboardController");
const AdminStoreController = require("../controllers/AdminStoreController");
const router = express.Router();

// عرض صفحة لوحة التحكم
router.get("/dashboard", AdminDashboardController.showDashboard);

// عرض صفحة طلبات إنشاء المتجر
router.get("/store-requests", AdminStoreController.showStoreRequestsPage);

module.exports = router;