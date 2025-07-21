const db = require("../config/db.js");

class ProfileModels {
  static async GetProfileModels(userId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT id, name, avatar, age, gender, country, language, email, portfolio, occupation, phone, quote, likes, ranking, liked, DATE(created_at) as join_date FROM users WHERE id = ?";
      db.query(query, [userId], (error, results) => {
        if (error) return reject(error);
        const user = results[0];
        user.avatar = user.avatar && user.avatar.startsWith('http') ? user.avatar : '/uploads/images/pngwing.com.png';
        resolve(user);
      });
    });
  }
  
  static async UpdateProfileModels(userId, updatedData) {
    return new Promise((resolve, reject) => {
      const { name, avatar, age, gender, country, language, occupation, phone, portfolio } = updatedData;
      const query =
        "UPDATE users SET name = ?, avatar = ?, age = ?, gender = ?, country = ?, language = ?, occupation = ?, phone = ?, portfolio = ? WHERE id = ?";
      db.query(
        query,
        [name, avatar, age, gender, country, language, occupation, phone, portfolio, userId],
        (error, results) => {
          if (error) return reject(error);
          console.log("Update query results:", results);
          resolve(results);
        }
      );
    });
  }

  static async getAvatarById(userId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT avatar FROM users WHERE id = ?";
      db.query(query, [userId], (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  }

  // تحسين منطق التقييم مع عوامل إضافية
  static async calculateUserRanking(userId) {
    return new Promise((resolve, reject) => {
      // الحصول على بيانات المستخدم
      const userQuery = `
        SELECT 
          u.likes,
          u.created_at,
          COUNT(DISTINCT f1.id) + COUNT(DISTINCT f2.id) as friend_count,
          COUNT(DISTINCT dg.id) as design_count
        FROM users u
        LEFT JOIN friend_requests f1 ON (f1.sender_id = u.id OR f1.receiver_id = u.id) AND f1.status = 'accepted'
        LEFT JOIN friend_requests f2 ON (f2.sender_id = u.id OR f2.receiver_id = u.id) AND f2.status = 'accepted'
        LEFT JOIN design_gallery dg ON dg.user_id = u.id
        WHERE u.id = ?
        GROUP BY u.id
      `;
      
      db.query(userQuery, [userId], (err, results) => {
        if (err) return reject(err);
        if (!results || results.length === 0) {
          return reject(new Error("المستخدم غير موجود"));
        }

        const userData = results[0];
        const likes = userData.likes || 0;
        const friendCount = userData.friend_count || 0;
        const designCount = userData.design_count || 0;
        const accountAge = Math.floor((Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24)); // بالأيام

        // حساب التقييم المحسن
        let ranking = 0;
        
        // نقاط الإعجابات (الوزن الأكبر)
        ranking += likes * 3;
        
        // نقاط الأصدقاء
        ranking += Math.min(friendCount, 20) * 2; // حد أقصى 40 نقطة
        
        // نقاط أعمال التصميم
        ranking += Math.min(designCount, 10) * 5; // حد أقصى 50 نقطة
        
        // نقاط النشاط (بناءً على عمر الحساب)
        if (accountAge > 0) {
          ranking += Math.min(Math.floor(accountAge / 7), 10); // نقطة واحدة كل أسبوع، حد أقصى 10
        }
        
        // تحويل إلى مستوى (كل 10 نقاط = مستوى واحد)
        const level = Math.floor(ranking / 10);
        
        resolve({ ranking: level, totalPoints: ranking });
      });
    });
  }

  static async toggleLike(userId, friendId) {
    return new Promise((resolve, reject) => {
      const checkQuery = `SELECT * FROM likes WHERE user_id = ? AND friend_id = ?`;
      db.query(checkQuery, [userId, friendId], async (err, results) => {
        if (err) return reject(err);

        const hasLiked = results.length > 0;

        if (hasLiked) {
          const deleteQuery = `DELETE FROM likes WHERE user_id = ? AND friend_id = ?`;
          db.query(deleteQuery, [userId, friendId], async (err) => {
            if (err) return reject(err);

            // تحديث عدد الإعجابات
            const updateLikesQuery = `UPDATE users SET likes = GREATEST(likes - 1, 0) WHERE id = ?`;
            db.query(updateLikesQuery, [friendId], async (err) => {
              if (err) return reject(err);

              try {
                // إعادة حساب التقييم
                const rankingData = await ProfileModels.calculateUserRanking(friendId);
                
                // تحديث التقييم في قاعدة البيانات
                const updateRankingQuery = `UPDATE users SET ranking = ? WHERE id = ?`;
                db.query(updateRankingQuery, [rankingData.ranking, friendId], (err) => {
                  if (err) return reject(err);

                  // الحصول على البيانات المحدثة
                  db.query("SELECT likes, ranking FROM users WHERE id = ?", [friendId], (err, result) => {
                    if (err) return reject(err);
                    if (!result || result.length === 0) {
                      return reject(new Error("لم يتم العثور على المستخدم"));
                    }
                    resolve({ 
                      success: true, 
                      likes: result[0].likes, 
                      ranking: result[0].ranking, 
                      liked: false 
                    });
                  });
                });
              } catch (error) {
                reject(error);
              }
            });
          });
        } else {
          const insertQuery = `INSERT INTO likes (user_id, friend_id) VALUES (?, ?)`;
          db.query(insertQuery, [userId, friendId], async (err) => {
            if (err) return reject(err);

            // تحديث عدد الإعجابات
            const updateLikesQuery = `UPDATE users SET likes = likes + 1 WHERE id = ?`;
            db.query(updateLikesQuery, [friendId], async (err) => {
              if (err) return reject(err);

              try {
                // إعادة حساب التقييم
                const rankingData = await ProfileModels.calculateUserRanking(friendId);
                
                // تحديث التقييم في قاعدة البيانات
                const updateRankingQuery = `UPDATE users SET ranking = ? WHERE id = ?`;
                db.query(updateRankingQuery, [rankingData.ranking, friendId], (err) => {
                  if (err) return reject(err);

                  // الحصول على البيانات المحدثة
                  db.query("SELECT likes, ranking FROM users WHERE id = ?", [friendId], (err, result) => {
                    if (err) return reject(err);
                    if (!result || result.length === 0) {
                      return reject(new Error("لم يتم العثور على المستخدم"));
                    }
                    resolve({ 
                      success: true, 
                      likes: result[0].likes, 
                      ranking: result[0].ranking, 
                      liked: true 
                    });
                  });
                });
              } catch (error) {
                reject(error);
              }
            });
          });
        }
      });
    });
  }

  static async hasUserLiked(userId, friendId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT COUNT(*) AS count FROM likes WHERE user_id = ? AND friend_id = ?`;
      db.query(query, [userId, friendId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0].count > 0);
      });
    });
  }

  static async checkFriendStatus(userId, friendId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          CASE 
            WHEN (sender_id = ? AND receiver_id = ? AND status = 'pending') THEN 'pending_sent'
            WHEN (sender_id = ? AND receiver_id = ? AND status = 'pending') THEN 'pending_received'
            WHEN ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) 
                 AND status = 'accepted' THEN 'accepted'
            ELSE 'no_friend'
          END AS status
        FROM friend_requests 
        WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
        LIMIT 1
      `;
      db.query(
        query,
        [userId, friendId, friendId, userId, userId, friendId, friendId, userId, userId, friendId, friendId, userId],
        (error, results) => {
          if (error) return reject(error);
          resolve(results.length === 0 ? 'no_friend' : results[0].status);
        }
      );
    });
  }

  static async sendFriendRequest(userId, friendId) {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO friend_requests (sender_id, receiver_id, status) VALUES (?, ?, 'pending')";
      db.query(query, [userId, friendId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async cancelFriendRequest(userId, friendId) {
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM friend_requests 
        WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'
      `;
      db.query(query, [userId, friendId], (err, results) => {
        if (err) reject(err);
        else resolve(results.affectedRows > 0);
      });
    });
  }

  static async updateUserQuote(userId, quote) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE users SET quote = ? WHERE id = ?";
      db.query(query, [quote, userId], (error, results) => {
        if (error) return reject(error);
        resolve(results.affectedRows > 0);
      });
    });
  }
  
  static async getGallery(userId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT id, user_id, image, title, subtitle FROM design_gallery WHERE user_id = ? ORDER BY created_at DESC";
      db.query(query, [userId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  static async addDesign(userId, image, title, subtitle) {
    return new Promise(async (resolve, reject) => {
      const query = "INSERT INTO design_gallery (user_id, image, title, subtitle) VALUES (?, ?, ?, ?)";
      db.query(query, [userId, image, title, subtitle], async (error, result) => {
        if (error) {
          console.error('خطأ في إدخال التصميم في قاعدة البيانات:', error);
          return reject(error);
        }
        try {
          // لا تحدث التقييم إذا كان userId = 0 أو غير معرف
          if (userId && userId != 0) {
            const rankingData = await ProfileModels.calculateUserRanking(userId);
            const updateRankingQuery = `UPDATE users SET ranking = ? WHERE id = ?`;
            db.query(updateRankingQuery, [rankingData.ranking, userId], (err) => {
              if (err) console.error("Error updating ranking after design addition:", err);
              resolve(result.insertId);
            });
          } else {
            resolve(result.insertId);
          }
        } catch (error) {
          console.error("Error calculating ranking after design addition:", error);
          resolve(result.insertId);
        }
      });
    });
  }

  static async deleteDesign(designId, userId) {
    return new Promise(async (resolve, reject) => {
      // إذا كان التصميم مجهول (user_id IS NULL) احذفه مباشرة
      const query = "DELETE FROM design_gallery WHERE id = ? AND (user_id = ? OR user_id IS NULL)";
      db.query(query, [designId, userId], async (error, result) => {
        if (error) return reject(error);
        
        if (result.affectedRows > 0) {
          try {
            // إعادة حساب التقييم بعد حذف عمل تصميم
            if (userId) {
              const rankingData = await ProfileModels.calculateUserRanking(userId);
              const updateRankingQuery = `UPDATE users SET ranking = ? WHERE id = ?`;
              db.query(updateRankingQuery, [rankingData.ranking, userId], (err) => {
                if (err) console.error("Error updating ranking after design deletion:", err);
                resolve(true);
              });
            } else {
              resolve(true);
            }
          } catch (error) {
            console.error("Error calculating ranking after design deletion:", error);
            resolve(true);
          }
        } else {
          resolve(false);
        }
      });
    });
  }

  static async acceptFriendRequest(senderId, receiverId) {
    return new Promise(async (resolve, reject) => {
      const query = `
        UPDATE friend_requests 
        SET status = 'accepted' 
        WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'
      `;
      db.query(query, [senderId, receiverId], async (err, results) => {
        if (err) reject(err);
        else {
          if (results.affectedRows > 0) {
            try {
              // إعادة حساب التقييم لكلا المستخدمين بعد قبول الصداقة
              const senderRanking = await ProfileModels.calculateUserRanking(senderId);
              const receiverRanking = await ProfileModels.calculateUserRanking(receiverId);
              
              const updateSenderQuery = `UPDATE users SET ranking = ? WHERE id = ?`;
              const updateReceiverQuery = `UPDATE users SET ranking = ? WHERE id = ?`;
              
              db.query(updateSenderQuery, [senderRanking.ranking, senderId], (err) => {
                if (err) console.error("Error updating sender ranking:", err);
              });
              
              db.query(updateReceiverQuery, [receiverRanking.ranking, receiverId], (err) => {
                if (err) console.error("Error updating receiver ranking:", err);
              });
            } catch (error) {
              console.error("Error calculating ranking after friend acceptance:", error);
            }
          }
          resolve(results.affectedRows > 0);
        }
      });
    });
  }

  static async removeFriend(userId, friendId) {
    return new Promise(async (resolve, reject) => {
      const query = `
        DELETE FROM friend_requests 
        WHERE (sender_id = ? AND receiver_id = ?) 
           OR (sender_id = ? AND receiver_id = ?)
      `;
      db.query(query, [userId, friendId, friendId, userId], async (err, results) => {
        if (err) reject(err);
        else {
          if (results.affectedRows > 0) {
            try {
              // إعادة حساب التقييم لكلا المستخدمين بعد إزالة الصداقة
              const userRanking = await ProfileModels.calculateUserRanking(userId);
              const friendRanking = await ProfileModels.calculateUserRanking(friendId);
              
              const updateUserQuery = `UPDATE users SET ranking = ? WHERE id = ?`;
              const updateFriendQuery = `UPDATE users SET ranking = ? WHERE id = ?`;
              
              db.query(updateUserQuery, [userRanking.ranking, userId], (err) => {
                if (err) console.error("Error updating user ranking:", err);
              });
              
              db.query(updateFriendQuery, [friendRanking.ranking, friendId], (err) => {
                if (err) console.error("Error updating friend ranking:", err);
              });
            } catch (error) {
              console.error("Error calculating ranking after friend removal:", error);
            }
          }
          resolve(results.affectedRows > 0);
        }
      });
    });
  }

  // دالة لتحديث تقييمات جميع المستخدمين (يمكن استخدامها كمهمة دورية)
  static async updateAllUserRankings() {
    return new Promise((resolve, reject) => {
      const getUsersQuery = "SELECT id FROM users WHERE is_active = 1";
      db.query(getUsersQuery, async (err, users) => {
        if (err) return reject(err);
        
        const updatePromises = users.map(async (user) => {
          try {
            const rankingData = await ProfileModels.calculateUserRanking(user.id);
            return new Promise((resolve, reject) => {
              const updateQuery = `UPDATE users SET ranking = ? WHERE id = ?`;
              db.query(updateQuery, [rankingData.ranking, user.id], (err) => {
                if (err) reject(err);
                else resolve();
              });
            });
          } catch (error) {
            console.error(`Error updating ranking for user ${user.id}:`, error);
            return Promise.resolve();
          }
        });
        
        try {
          await Promise.all(updatePromises);
          resolve({ success: true, updatedUsers: users.length });
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  // دالة للحصول على أفضل المستخدمين حسب التقييم
  static async getTopRankedUsers(limit = 10) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT id, name, avatar, ranking, likes 
        FROM users 
        WHERE is_active = 1 
        ORDER BY ranking DESC, likes DESC 
        LIMIT ?
      `;
      db.query(query, [limit], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }
}

module.exports = ProfileModels;

