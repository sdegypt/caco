const express = require("express");
const AdminForumSettingsController = require("../controllers/AdminForumSettingsController");
const router = express.Router();

// عرض صفحة إعدادات المنتدى
router.get("/forum-settings", AdminForumSettingsController.showForumSettings);

// تحديث إعدادات المنتدى
router.post("/forum-settings", AdminForumSettingsController.updateForumSettings);

// إضافة استثناء
router.post("/forum-settings/add-exception", AdminForumSettingsController.addException);

// إزالة استثناء
router.post("/forum-settings/remove-exception", AdminForumSettingsController.removeException);

// تحديث حدود الاستثناء
router.post("/forum-settings/update-exception", AdminForumSettingsController.updateException);

module.exports = router;