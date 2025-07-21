const db = require("../config/db");

class ChatModel {
  static async getMessages(userId, friendId) {
    const query = `
      SELECT m.*, u.name AS sender_name, u.avatar AS sender_avatar
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId, friendId, friendId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  static async getMessagesAfterTimestamp(userId, friendId, timestamp) {
    const query = `
      SELECT m.*, u.name AS sender_name, u.avatar AS sender_avatar
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE ((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?))
      AND UNIX_TIMESTAMP(m.created_at) * 1000 > ?
      ORDER BY m.created_at ASC
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId, friendId, friendId, userId, timestamp], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  static async createMessage(senderId, receiverId, content, imagePath) {
    const query = `
      INSERT INTO messages (sender_id, receiver_id, content, image_path, is_read)
      VALUES (?, ?, ?, ?, 0)
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [senderId, receiverId, content, imagePath], (err, result) => {
        if (err) return reject(err);
        resolve({
          id: result.insertId,
          sender_id: senderId,
          receiver_id: receiverId,
          content,
          image_path: imagePath,
          is_read: 0,
          created_at: new Date().toISOString(),
        });
      });
    });
  }

  static async getMessageById(messageId) {
    const query = `SELECT * FROM messages WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [messageId], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });
  }

  static async deleteMessage(messageId) {
    const query = `DELETE FROM messages WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [messageId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  static async deleteAllMessages(userId) {
    const query = `DELETE FROM messages WHERE receiver_id = ? OR sender_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [userId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  static async getReceivedMessages(userId) {
    const query = `
      SELECT m.*, u.name AS sender_name, u.avatar AS sender_avatar
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      WHERE m.receiver_id = ?
      ORDER BY m.created_at DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static async getUserById(userId) {
    const query = `
      SELECT id, name, avatar, age, gender, country, language, occupation, quote, phone, email, portfolio, last_active
      FROM users
      WHERE id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0] || null);
      });
    });
  }

  static async getLatestMessagesForFriends(userId) {
    const query = `
      SELECT m.*, u.name AS sender_name, u.avatar AS sender_avatar
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      WHERE m.id IN (
        SELECT MAX(id)
        FROM messages
        WHERE receiver_id = ? OR sender_id = ?
        GROUP BY LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id)
      )
      ORDER BY m.created_at DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId, userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static async getFriendshipStatus(userId, friendId) {
    const query = `
      SELECT status
      FROM friendships
      WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId, friendId, friendId, userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows.length > 0 ? rows[0].status : null);
      });
    });
  }

  static async markAllAsRead(userId) {
    const query = `
      UPDATE messages 
      SET is_read = 1 
      WHERE receiver_id = ? AND is_read = 0
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  static async markAsRead(messageId) {
    const query = `
      UPDATE messages 
      SET is_read = 1 
      WHERE id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [messageId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  static async getUnreadCount(userId) {
    const query = `
      SELECT COUNT(*) AS unread_count 
      FROM messages 
      WHERE receiver_id = ? AND is_read = 0
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0].unread_count || 0);
      });
    });
  }

  static async isUserBlocked(userId, blockedUserId) {
    const query = `
      SELECT * FROM block_list
      WHERE blocker_id = ? AND blocked_id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [blockedUserId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result.length > 0);
      });
    });
  }

  static async updateUserAvatar(userId, avatarPath) {
    const query = `UPDATE users SET avatar = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [avatarPath, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  static async updateLastActive(userId) {
    const query = `UPDATE users SET last_active = NOW() WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  static async getAvatarUpdates(userId1, userId2) {
    const query = `
      SELECT id as userId, avatar
      FROM users
      WHERE id IN (?, ?)
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId1, userId2], (err, results) => {
        if (err) return reject(err);
        const updates = results.map(user => ({
          userId: user.userId,
          avatar: user.avatar && user.avatar.startsWith('http') ? user.avatar : "/uploads/images/pngwing.com.png"
        }));
        resolve(updates);
      });
    });
  }
}

module.exports = ChatModel;
