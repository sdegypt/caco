const express = require("express");
const AdminRolesPermissionsController = require("../controllers/AdminRolesPermissionsController");
const router = express.Router();

// عرض صفحة إعدادات الأدوار والصلاحيات
router.get("/roles-permissions", AdminRolesPermissionsController.showRolesPermissions);

// تحديث الأدوار والصلاحيات
router.post("/roles-permissions", AdminRolesPermissionsController.updateRolesPermissions);

// إضافة دور جديد
router.post("/roles-permissions/add-role", AdminRolesPermissionsController.addRole);

// إضافة صلاحية جديدة
router.post("/roles-permissions/add-permission", AdminRolesPermissionsController.addPermission);

module.exports = router;