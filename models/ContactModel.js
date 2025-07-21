const db = require('../config/db'); // تأكد من أن هذا يشير إلى مكتبة mysql

class ContactModel {
    static createMessage(name, email, subject, message) {
        const query = 'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            db.query(query, [name, email, subject, message], (error, result) => {
                if (error) {
                    console.error('Database Error:', error);
                    return reject(new Error('Error creating contact message: ' + error.message));
                }
                console.log('Query Result:', result); // تسجيل النتيجة للتحقق
                if (result && result.insertId) {
                    resolve(result.insertId);
                } else {
                    reject(new Error('No valid insert ID returned from database'));
                }
            });
        });
    }

    static getAllMessages() {
        const query = 'SELECT * FROM contact_messages ORDER BY created_at DESC';
        return new Promise((resolve, reject) => {
            db.query(query, (error, rows) => {
                if (error) {
                    return reject(new Error('Error fetching contact messages: ' + error.message));
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

module.exports = ContactModel;