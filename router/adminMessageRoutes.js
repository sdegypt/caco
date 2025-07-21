const express = require('express');
const AdminMessageController = require('../controllers/AdminMessageController');
const router = express.Router();

router.get('/messages', AdminMessageController.getMessagesPage);
router.post('/messages/:id/read', AdminMessageController.markMessageAsRead);

module.exports = router;