const express = require('express');
const ContactController = require('../controllers/ContactController');
const router = express.Router();

router.get('/contact', ContactController.getContactPage);
router.post('/contact/send', ContactController.sendMessage);

module.exports = router;