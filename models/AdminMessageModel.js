const db = require('../config/db');

class AdminMessageModel {
    static getAllMessages() {
        const query = 'SELECT * FROM contact_messages ORDER BY created_at DESC';
        return new Promise((resolve, reject) => {
            db.query(query, (error, rows) => {
                if (error) {
                    return reject(new Error('Error fetching messages: ' + error.message));
                }
                resolve(rows);
            });
        });
    }

    static markAsRead(id) {
        const query = 'UPDATE contact_messages SET is_read = 1 WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (error, result) => {
                if (error) {
                    return reject(new Error('Error marking message as read: ' + error.message));
                }
                resolve(result.affectedRows > 0);
            });
        });
    }
}

module.exports = AdminMessageModel;