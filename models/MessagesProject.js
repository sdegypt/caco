const db = require("../config/db");

class MessagesProject {
  static create(messageData) {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO messages_project (project_id, sender_id, receiver_id, message, status, conversation_id) VALUES (?, ?, ?, ?, ?, ?)";
      const values = [
        messageData.project_id,
        messageData.sender_id,
        messageData.receiver_id,
        messageData.message,
        messageData.status,
        messageData.conversation_id || null,
      ];

      console.log("استعلام إنشاء الرسالة:", sql, "القيم:", values); // تسجيل للتحقق

      db.query(sql, values, (err, result) => {
        if (err) return reject(err);
        resolve(result); // إرجاع النتيجة الكاملة بما في ذلك insertId
      });
    });
  }

  static findByProjectId(projectId) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM messages_project WHERE project_id = ?";
      db.query(sql, [projectId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  static findByConversationId(conversationId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT m.*, u.name AS sender_name, p.title AS project_name
        FROM messages_project m
        JOIN users u ON m.sender_id = u.id
        JOIN projects p ON m.project_id = p.id
        WHERE m.conversation_id = ?
      `;
      db.query(sql, [conversationId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  static getChatsByUser(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT DISTINCT m.conversation_id, p.title AS project_title,
          CASE
            WHEN m.sender_id = ? THEN u2.name
            WHEN m.receiver_id = ? THEN u1.name
          END AS other_user_name
        FROM messages_project m
        JOIN projects p ON m.project_id = p.id
        LEFT JOIN users u1 ON m.sender_id = u1.id
        LEFT JOIN users u2 ON m.receiver_id = u2.id
        WHERE m.sender_id = ? OR m.receiver_id = ?
        ORDER BY m.created_at DESC
      `;
      db.query(sql, [userId, userId, userId, userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
}

module.exports = MessagesProject;