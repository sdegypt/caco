const db = require("../config/db");

class ForumModel {
  static async addPost(userId, content, images) {
    // التحقق من الحد اليومي يتم في NotificationModel.canUserPost
    const query = `
      INSERT INTO postsforum (user_id, content, image1, image2, image3, image4, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    const imageValues = Array(4).fill(null);
    images.forEach((image, index) => {
      if (index < 4) imageValues[index] = image;
    });

    return new Promise((resolve, reject) => {
      db.query(query, [userId, content, ...imageValues], (err, result) => {
        if (err) {
          console.error("خطأ في إضافة المنشور:", err);
          return reject(new Error("خطأ في إضافة المنشور"));
        }
        resolve(result);
      });
    });
  }

  static async deletePost(postId) {
    const query = `DELETE FROM postsforum WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [postId], (err, result) => {
        if (err) {
          console.error("خطأ في حذف المنشور:", err);
          return reject(new Error("خطأ في حذف المنشور"));
        }
        resolve(result);
      });
    });
  }

  static async editPost(postId, content, images) {
    const query = `
      UPDATE postsforum 
      SET content = ?, image1 = ?, image2 = ?, image3 = ?, image4 = ? 
      WHERE id = ?
    `;
    const imageValues = Array(4).fill(null);
    images.forEach((image, index) => {
      if (index < 4) imageValues[index] = image;
    });

    return new Promise((resolve, reject) => {
      db.query(query, [content, ...imageValues, postId], (err, result) => {
        if (err) {
          console.error("خطأ في تحديث المنشور:", err);
          return reject(new Error("خطأ في تحديث المنشور"));
        }
        resolve(result);
      });
    });
  }

  static async toggleLike(postId, userId) {
    const checkQuery = `SELECT * FROM likes WHERE post_id = ? AND user_id = ?`;
    const addQuery = `INSERT INTO likes (post_id, user_id, created_at) VALUES (?, ?, NOW())`;
    const deleteQuery = `DELETE FROM likes WHERE post_id = ? AND user_id = ?`;

    return new Promise((resolve, reject) => {
      db.query(checkQuery, [postId, userId], (err, result) => {
        if (err) {
          console.error("خطأ في التحقق من الإعجاب:", err);
          return reject(new Error("خطأ في التحقق من الإعجاب"));
        }
        if (result.length > 0) {
          db.query(deleteQuery, [postId, userId], (delErr) => {
            if (delErr) {
              console.error("خطأ في حذف الإعجاب:", delErr);
              return reject(new Error("خطأ في حذف الإعجاب"));
            }
            resolve(false);
          });
        } else {
          db.query(addQuery, [postId, userId], (addErr) => {
            if (addErr) {
              console.error("خطأ في إضافة الإعجاب:", addErr);
              return reject(new Error("خطأ في إضافة الإعجاب"));
            }
            resolve(true);
          });
        }
      });
    });
  }

  static async getLikeCount(postId) {
    const query = `SELECT COUNT(*) AS like_count FROM likes WHERE post_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [postId], (err, result) => {
        if (err) {
          console.error("خطأ في جلب عدد الإعجابات:", err);
          return reject(new Error("خطأ في جلب عدد الإعجابات"));
        }
        resolve(result[0].like_count);
      });
    });
  }

  static async addComment(postId, userId, content) {
    // التحقق من الحد اليومي يتم في NotificationModel.canUserComment
    const query = `INSERT INTO commentsforum (post_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())`;
    return new Promise((resolve, reject) => {
      db.query(query, [postId, userId, content], (err, result) => {
        if (err) {
          console.error("خطأ في إضافة التعليق:", err);
          return reject(new Error("خطأ في إضافة التعليق"));
        }
        resolve(result);
      });
    });
  }

  static async getComments(postId) {
    const query = `
      SELECT c.content, c.created_at, u.id AS user_id, u.name AS user_name, 
             IFNULL(u.avatar, '/uploads/images/pngwing.com.png') AS user_avatar
      FROM commentsforum c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [postId], (err, results) => {
        if (err) {
          console.error("خطأ في جلب التعليقات:", err);
          return reject(new Error("خطأ في جلب التعليقات"));
        }
        resolve(results);
      });
    });
  }

  static async getUserById(userId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE id = ?";
      db.query(query, [userId], (err, results) => {
        if (err) return reject(err);
        if (!results[0]) return resolve(null);
        const user = results[0];
        user.avatar = user.avatar && user.avatar.startsWith('http') ? user.avatar : '/uploads/images/pngwing.com.png';
        resolve(user);
      });
    });
  }

  static async toggleLikeComment(commentId, userId) {
    const checkQuery = `SELECT * FROM comment_likes WHERE comment_id = ? AND user_id = ?`;
    const addQuery = `INSERT INTO comment_likes (comment_id, user_id, created_at) VALUES (?, ?, NOW())`;
    const deleteQuery = `DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?`;

    return new Promise((resolve, reject) => {
      db.query(checkQuery, [commentId, userId], (err, result) => {
        if (err) {
          console.error("خطأ في التحقق من الإعجاب على التعليق:", err);
          return reject(new Error("خطأ في التحقق من الإعجاب على التعليق"));
        }
        if (result.length > 0) {
          db.query(deleteQuery, [commentId, userId], (delErr) => {
            if (delErr) {
              console.error("خطأ في حذف الإعجاب على التعليق:", delErr);
              return reject(new Error("خطأ في حذف الإعجاب على التعليق"));
            }
            resolve(false);
          });
        } else {
          db.query(addQuery, [commentId, userId], (addErr) => {
            if (addErr) {
              console.error("خطأ في إضافة الإعجاب على التعليق:", addErr);
              return reject(new Error("خطأ في إضافة الإعجاب على التعليق"));
            }
            resolve(true);
          });
        }
      });
    });
  }

  static async getAllPosts(userId) {
    const query = `
      SELECT p.id, p.content, p.image1, p.image2, p.image3, p.image4,
             p.created_at, u.id AS user_id, u.name AS user_name, 
             IFNULL(u.avatar, '/uploads/images/pngwing.com.png') AS user_avatar,
             (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
             (SELECT COUNT(*) FROM commentsforum WHERE post_id = p.id) AS comment_count
      FROM postsforum p
      JOIN users u ON p.user_id = u.id
      WHERE p.id NOT IN (SELECT post_id FROM hidden_posts WHERE user_id = ? OR user_id IS NULL)
      ORDER BY p.created_at DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId || null], (err, results) => {
        if (err) {
          console.error("خطأ في جلب جميع المنشورات:", err);
          return reject(new Error("خطأ في جلب المنشورات"));
        }
        resolve(results);
      });
    });
  }

  static async getPostDetails(postId) {
    const query = `
      SELECT p.id, p.content, p.image1, p.image2, p.image3, p.image4,
             p.created_at, u.id AS user_id, u.name AS user_name, u.avatar AS user_avatar
      FROM postsforum p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [postId], (err, results) => {
        if (err) {
          console.error("خطأ في جلب تفاصيل المنشور:", err);
          return reject(new Error("خطأ في جلب تفاصيل المنشور"));
        }
        resolve(results[0]);
      });
    });
  }

  static async hidePost(userId, postId) {
    const query = `INSERT INTO hidden_posts (user_id, post_id) VALUES (?, ?)`;
    return new Promise((resolve, reject) => {
      db.query(query, [userId, postId], (err, result) => {
        if (err) {
          console.error("خطأ في إخفاء المنشور:", err);
          return reject(new Error("خطأ في إخفاء المنشور"));
        }
        resolve(result);
      });
    });
  }

  static async checkHiddenPost(userId, postId) {
    const query = `SELECT * FROM hidden_posts WHERE user_id = ? AND post_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [userId, postId], (err, result) => {
        if (err) {
          console.error("خطأ في التحقق من إخفاء المنشور:", err);
          return reject(new Error("خطأ في التحقق من إخفاء المنشور"));
        }
        resolve(result.length > 0);
      });
    });
  }

  static async isPostOwner(postId, userId) {
    const query = `SELECT * FROM postsforum WHERE id = ? AND user_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [postId, userId], (err, result) => {
        if (err) {
          console.error("خطأ في التحقق من ملكية المنشور:", err);
          return reject(new Error("خطأ في التحقق من ملكية المنشور"));
        }
        resolve(result.length > 0);
      });
    });
  }

  static async hasLikedPost(postId, userId) {
    const query = `SELECT * FROM likes WHERE post_id = ? AND user_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [postId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result.length > 0);
      });
    });
  }

  static async sharePost(userId, postId) {
    const query = `INSERT INTO shares (user_id, post_id, created_at) VALUES (?, ?, NOW())`;
    return new Promise((resolve, reject) => {
      db.query(query, [userId, postId], (err, result) => {
        if (err) {
          console.error("خطأ في مشاركة المنشور:", err);
          return reject(new Error("خطأ في مشاركة المنشور"));
        }
        resolve(result);
      });
    });
  }

  static async uploadAvatar(userId, avatar) {
    const query = `UPDATE users SET avatar = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [avatar, userId], (err, result) => {
        if (err) {
          console.error("خطأ في رفع الصورة الرمزية:", err);
          return reject(new Error("خطأ في رفع الصورة الرمزية"));
        }
        resolve(result);
      });
    });
  }

  static async getUserAvatar(userId) {
    return this.getUserById(userId);
  }

  static async addAd(userId, title, description, image) {
    // التحقق من الحد اليومي يتم في NotificationModel.canUserAddAd
    const query = `
      INSERT INTO ads (user_id, title, description, image, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId, title, description, image], (err, result) => {
        if (err) {
          console.error("خطأ في إضافة الإعلان:", err);
          return reject(new Error("خطأ في إضافة الإعلان"));
        }
        resolve(result.insertId);
      });
    });
  }

  static async getAllAds() {
    const query = `
      SELECT a.id, a.title, a.description, a.image, a.created_at, u.name AS user_name, u.avatar AS user_avatar
      FROM ads a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) {
          console.error("خطأ في جلب الإعلانات:", err);
          return reject(new Error("خطأ في جلب الإعلانات"));
        }
        resolve(results);
      });
    });
  }

  static async deleteOldAds() {
    const query = `
      DELETE FROM ads 
      WHERE created_at < NOW() - INTERVAL 24 HOUR
    `;
    return new Promise((resolve, reject) => {
      db.query(query, (err, result) => {
        if (err) {
          console.error("خطأ في حذف الإعلانات القديمة:", err);
          return reject(new Error("خطأ في حذف الإعلانات القديمة"));
        }
        console.log(`تم حذف ${result.affectedRows} إعلانات قديمة`);
        resolve(result);
      });
    });
  }

  static async getDailyAdCount(userId) {
    const query = `
      SELECT COUNT(*) AS ad_count 
      FROM ads 
      WHERE user_id = ? 
      AND DATE(created_at) = CURDATE()
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, result) => {
        if (err) {
          console.error("خطأ في جلب عدد الإعلانات اليومية:", err);
          return reject(new Error("خطأ في جلب عدد الإعلانات اليومية"));
        }
        resolve(result[0].ad_count);
      });
    });
  }

  static async getUserPosts(userId) {
    const query = `
      SELECT p.id, p.content, p.image1, p.image2, p.image3, p.image4,
             p.created_at, u.id AS user_id, u.name AS user_name, 
             IFNULL(u.avatar, '/uploads/images/pngwing.com.png') AS user_avatar,
             (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
             (SELECT COUNT(*) FROM commentsforum WHERE post_id = p.id) AS comment_count
      FROM postsforum p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) {
          console.error("خطأ في جلب منشورات المستخدم:", err);
          return reject(new Error("خطأ في جلب منشورات المستخدم"));
        }
        resolve(results);
      });
    });
  }

  static async getPaginatedPosts(limit, offset) {
    const query = `
      SELECT p.*, u.user_name, u.user_avatar
      FROM postsforum p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [limit, offset], (err, results) => {
        if (err) {
          console.error("خطأ في جلب المنشورات المرتبة:", err);
          return reject(new Error("خطأ في جلب المنشورات المرتبة"));
        }
        resolve(results);
      });
    });
  }

  // وظائف إدارة الإعلانات
  static async getAdById(adId) {
    const query = `
      SELECT a.*, u.user_name, u.user_avatar
      FROM ads a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [adId], (err, results) => {
        if (err) {
          console.error("خطأ في جلب الإعلان:", err);
          return reject(new Error("خطأ في جلب الإعلان"));
        }
        resolve(results[0] || null);
      });
    });
  }

  static async updateAd(adId, title, description, newImage) {
    let query, params;
    
    if (newImage) {
      query = `
        UPDATE ads 
        SET title = ?, description = ?, image = ?, updated_at = NOW()
        WHERE id = ?
      `;
      params = [title, description, newImage, adId];
    } else {
      query = `
        UPDATE ads 
        SET title = ?, description = ?, updated_at = NOW()
        WHERE id = ?
      `;
      params = [title, description, adId];
    }

    return new Promise((resolve, reject) => {
      db.query(query, params, (err, result) => {
        if (err) {
          console.error("خطأ في تحديث الإعلان:", err);
          return reject(new Error("خطأ في تحديث الإعلان"));
        }
        
        // جلب الإعلان المحدث
        this.getAdById(adId)
          .then(updatedAd => resolve(updatedAd))
          .catch(error => reject(error));
      });
    });
  }

  static async deleteAd(adId) {
    const query = `DELETE FROM ads WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [adId], (err, result) => {
        if (err) {
          console.error("خطأ في حذف الإعلان:", err);
          return reject(new Error("خطأ في حذف الإعلان"));
        }
        resolve(result);
      });
    });
  }
}

module.exports = ForumModel;
