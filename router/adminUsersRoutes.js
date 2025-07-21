const express = require('express');
const AdminUsersController = require('../controllers/AdminUsersController');
const router = express.Router();

// عرض قائمة المستخدمين
router.get('/users', AdminUsersController.showUsers);

// تعيين مستخدم كمسؤول
router.post('/users/:id/set-admin', AdminUsersController.setAdmin);

// تفعيل/تعطيل حساب مستخدم
router.post('/users/:id/toggle-block', AdminUsersController.toggleBlock);

module.exports = router; 