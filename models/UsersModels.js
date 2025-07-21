const db = require("../config/db");

class UsersModels {
  static async findById(id) {
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  }

  static async loginModel(email) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE email = ?";
      db.query(query, [email], (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  }

  static async loginModelById(id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT email FROM users WHERE id = ?";
      db.query(query, [id], (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  }
 static async createUser(
  name,
  age,
  gender,
  email,
  password,
  country = '',
  language = 'ar',
  occupation = '',
  phone = ''
) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO users (name, age, gender, email, password, country, language, occupation, phone)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [name, age, gender, email, password, country, language, occupation, phone];


    db.query(sql, values, (err, result) => {
      if (err) {
        return reject(err);
      }

      resolve(result.insertId);
    });
  });
}



  static async updatePassword(userId, hashedPassword) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE users SET password = ? WHERE id = ?";
      db.query(query, [hashedPassword, userId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  static async saveOTP(userId, otp) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE users SET reset_otp = ? WHERE id = ?";
      db.query(query, [otp, userId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  static async getOTP(userId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT reset_otp FROM users WHERE id = ?";
      db.query(query, [userId], (error, results) => {
        if (error) return reject(error);
        resolve(results[0]?.reset_otp || null);
      });
    });
  }

  static async clearOTP(userId) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE users SET reset_otp = NULL WHERE id = ?";
      db.query(query, [userId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  static async updateUser(userId, name, avatar, age, gender, country, language, occupation, phone, portfolio) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE users 
        SET 
          name = ?, avatar = ?, age = ?, gender = ?, country = ?, language = ?, occupation = ?, phone = ?, portfolio = ? 
        WHERE id = ?`;
      db.query(
        query,
        [name, avatar, age, gender, country, language, occupation, phone, portfolio, userId],
        (error, results) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });
  }

  static async sendFriendRequest(userId, friendId) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO friendships (user_id, friend_id, status) VALUES (?, ?, 'pending')";
      db.query(query, [userId, friendId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  static async acceptFriendRequest(userId, friendId) {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE friendships SET status = 'accepted' WHERE user_id = ? AND friend_id = ?";
      db.query(query, [userId, friendId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  static async rejectFriendRequest(userId, friendId) {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE friendships SET status = 'blocked' WHERE user_id = ? AND friend_id = ?";
      db.query(query, [userId, friendId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  static async getFriends(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.id, u.name, u.avatar 
        FROM users u
        JOIN friendships f ON (u.id = f.friend_id)
        WHERE f.user_id = ? AND f.status = 'accepted'`;
      db.query(query, [userId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  static async getFriendRequests(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.id, u.name, u.avatar 
        FROM users u
        JOIN friendships f ON (u.id = f.user_id)
        WHERE f.friend_id = ? AND f.status = 'pending'`;
      db.query(query, [userId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }
}

module.exports = UsersModels;