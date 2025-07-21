const db = require("../config/db");

class Conversation {
  static create(projectId, senderId, receiverId) {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO conversations (project_id, sender_id, receiver_id) VALUES (?, ?, ?)";
      db.query(sql, [projectId, senderId, receiverId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
}

module.exports = Conversation;