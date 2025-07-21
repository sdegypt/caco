const AdminMessageModel = require('../models/AdminMessageModel');

class AdminMessageController {
    static async getMessagesPage(req, res) {
        try {
            const messages = await AdminMessageModel.getAllMessages();
            res.render('admin/messages', { messages, unreadCount: res.locals.unreadCount });
        } catch (error) {
            res.status(500).send('Error fetching messages: ' + error.message);
        }
    }

    static async markMessageAsRead(req, res) {
        const { id } = req.params;
        try {
            const success = await AdminMessageModel.markAsRead(id);
            if (success) {
                res.redirect('/admin/messages');
            } else {
                res.status(404).send('Message not found');
            }
        } catch (error) {
            res.status(500).send('Error marking message as read: ' + error.message);
        }
    }
}

module.exports = AdminMessageController;