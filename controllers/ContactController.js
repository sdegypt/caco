const ContactModel = require('../models/ContactModel');

class ContactController {
    static async sendMessage(req, res) {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
        }

        try {
            const messageId = await ContactModel.createMessage(name, email, subject, message);
            return res.status(200).json({ success: true, message: 'تم إرسال الرسالة بنجاح', messageId });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getContactPage(req, res) {
        res.render('contact', { unreadCount: res.locals.unreadCount });
    }

    static async getAdminMessages(req, res) {
        try {
            const messages = await ContactModel.getAllMessages();
            res.render('admin/messages', { messages, unreadCount: res.locals.unreadCount });
        } catch (error) {
            res.status(500).send('Error fetching messages: ' + error.message);
        }
    }

    static async markMessageAsRead(req, res) {
        const { id } = req.params;
        try {
            const success = await ContactModel.markAsRead(id);
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

module.exports = ContactController;