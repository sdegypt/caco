const db = require("../config/db");

class NotificationModel {
  static createNotification(receiverId, senderId, type, message) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO notifications (user_id, sender_id, type, message, viewed, created_at)
        VALUES (?, ?, ?, ?, 0, NOW())
      `;
      db.query(query, [receiverId, senderId, type, message], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getNotifications(userId) {
    const query = `
      SELECT n.*, u.name AS sender_name, u.avatar AS sender_avatar
      FROM notifications n
      LEFT JOIN users u ON n.sender_id = u.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async getUserById(userId) {
    const query = `
      SELECT id, name, avatar, email, role
      FROM users
      WHERE id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  static async getUserByEmail(email) {
    const query = `
      SELECT id, name, avatar, email, role
      FROM users
      WHERE email = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [email], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  static async getNotificationById(notificationId) {
    const query = `
      SELECT id, user_id, sender_id
      FROM notifications
      WHERE id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [notificationId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  static async markAsViewed(notificationId) {
    const query = "UPDATE notifications SET viewed = 1 WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [notificationId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
  static async markAllAsViewed(userId) {
    const query = `
      UPDATE notifications 
      SET viewed = 1 
      WHERE user_id = ? AND viewed = 0
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
  static async deleteNotification(notificationId) {
    const query = "DELETE FROM notifications WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [notificationId], (err, result) => {
        if (err) reject(err);
        else if (result.affectedRows === 0) reject(new Error("الإشعار غير موجود"));
        else resolve(result);
      });
    });
  }

  static async deleteAllNotifications(userId) {
    const query = "DELETE FROM notifications WHERE user_id = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async createAdminNotificationForAllUsers(senderId, message, imageUrl) {
    const query = `
      INSERT INTO notifications (user_id, sender_id, type, message, image_url, viewed, created_at)
      SELECT id, ?, 'admin', ?, ?, 0, NOW()
      FROM users
      WHERE id != ? AND is_active = 1
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [senderId, message, imageUrl, senderId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getUnreadCount(userId) {
    const query = "SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = ? AND viewed = 0";
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0].unread_count || 0);
      });
    });
  }

  static async getAllUsers() {
    const query = "SELECT id, name, email, avatar, role, is_active FROM users ORDER BY id ASC";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async searchUsers(query) {
    const searchQuery = `
      SELECT id, name, email, avatar, role, is_active 
      FROM users 
      WHERE name LIKE ? OR email LIKE ? OR id = ? 
      ORDER BY id ASC
    `;
    const searchValue = `%${query}%`;
    return new Promise((resolve, reject) => {
      db.query(searchQuery, [searchValue, searchValue, query], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async setUserRole(userId, role) {
    const query = "UPDATE users SET role = ? WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [role, userId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async toggleUserBlock(userId, isActive) {
    const query = "UPDATE users SET is_active = ? WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [isActive, userId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getTotalUsers() {
    const query = "SELECT COUNT(*) as total FROM users";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].total);
      });
    });
  }

  static async getActiveUsersNow() {
    const query = "SELECT COUNT(*) as active FROM users WHERE last_active >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].active);
      });
    });
  }

  static async getNewUsersToday() {
    const query = "SELECT COUNT(*) as new_users FROM users WHERE DATE(created_at) = CURDATE()";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].new_users);
      });
    });
  }

  static async getNewUsersThisMonth() {
    const query = "SELECT COUNT(*) as new_users FROM users WHERE MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].new_users);
      });
    });
  }

  static async getBlockedUsers() {
    const query = "SELECT COUNT(*) as blocked FROM users WHERE is_active = 0";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].blocked);
      });
    });
  }

  static async getUsersByMonth() {
    const query = `
      SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count
      FROM users
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
      LIMIT 12
    `;
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async getUsersByGender() {
    const query = `
      SELECT 
        SUM(CASE WHEN gender = 'male' THEN 1 ELSE 0 END) as male,
        SUM(CASE WHEN gender = 'female' THEN 1 ELSE 0 END) as female
      FROM users
    `;
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async getUsersByCountry() {
    const query = `
      SELECT country, COUNT(*) as count
      FROM users
      GROUP BY country
      ORDER BY count DESC
      LIMIT 10
    `;
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async getUsersByAge() {
    const query = `
      SELECT 
        CASE 
          WHEN age < 18 THEN 'أقل من 18'
          WHEN age BETWEEN 18 AND 25 THEN '18-25'
          WHEN age BETWEEN 26 AND 35 THEN '26-35'
          WHEN age BETWEEN 36 AND 45 THEN '36-45'
          ELSE 'أكثر من 45'
        END as age_range,
        COUNT(*) as count
      FROM users
      GROUP BY 
        CASE 
          WHEN age < 18 THEN 'أقل من 18'
          WHEN age BETWEEN 18 AND 25 THEN '18-25'
          WHEN age BETWEEN 26 AND 35 THEN '26-35'
          WHEN age BETWEEN 36 AND 45 THEN '36-45'
          ELSE 'أكثر من 45'
        END
      ORDER BY age_range
    `;
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async getTotalAds() {
    const query = "SELECT COUNT(*) as total FROM ads";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].total);
      });
    });
  }

  static async getRecentAdsCount() {
    const query = "SELECT COUNT(*) as recent FROM ads ORDER BY created_at DESC LIMIT 5";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].recent);
      });
    });
  }

  static async getTotalPosts() {
    const query = "SELECT COUNT(*) as total FROM postsforum";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].total);
      });
    });
  }

  static async getTotalComments() {
    const query = "SELECT COUNT(*) as total FROM commentsforum";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].total);
      });
    });
  }

  static async getTotalLikes() {
    const query = "SELECT COUNT(*) as total FROM likes";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].total);
      });
    });
  }

  static async getTotalProjects() {
    const query = "SELECT COUNT(*) as total FROM projects";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].total);
      });
    });
  }

  static async getTotalProjectRequests() {
    const query = "SELECT COUNT(*) as total FROM project_applications";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].total);
      });
    });
  }

  static async getActiveProjects() {
    const query = "SELECT COUNT(*) as active FROM projects WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].active);
      });
    });
  }

  static async getTotalJobs() {
    const query = "SELECT COUNT(*) as total FROM jobs";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].total);
      });
    });
  }

  static async getTotalJobApplications() {
    const query = "SELECT COUNT(*) as total FROM job_applications";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].total);
      });
    });
  }

  static async getRecentJobs() {
    const query = "SELECT COUNT(*) as recent FROM jobs WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].recent);
      });
    });
  }

  static async getForumSettings() {
    const query = "SELECT setting_key, setting_value FROM forum_settings";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        const settings = {};
        results.forEach(row => {
          settings[row.setting_key] = row.setting_value;
        });
        resolve(settings);
      });
    });
  }

  static async updateForumSettings(settings) {
    const queries = Object.entries(settings).map(([key, value]) => {
      return new Promise((resolve, reject) => {
        const query = `
          INSERT INTO forum_settings (setting_key, setting_value) 
          VALUES (?, ?) 
          ON DUPLICATE KEY UPDATE setting_value = ?
        `;
        db.query(query, [key, value, value], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    });
    return Promise.all(queries);
  }

  static async getForumExceptions() {
    const query = `
      SELECT u.email, fe.user_id, fe.daily_job_limit, fe.daily_project_limit
      FROM forum_exceptions fe
      JOIN users u ON fe.user_id = u.id
    `;
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async addForumException(userId) {
    const query = `
      INSERT INTO forum_exceptions (user_id)
      VALUES (?)
      ON DUPLICATE KEY UPDATE user_id = user_id
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async removeForumException(userId) {
    const query = "DELETE FROM forum_exceptions WHERE user_id = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async updateForumException(userId, limits) {
    const query = `
      INSERT INTO forum_exceptions (user_id, daily_job_limit, daily_project_limit)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE daily_job_limit = ?, daily_project_limit = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [
        userId,
        limits.daily_job_limit,
        limits.daily_project_limit,
        limits.daily_job_limit,
        limits.daily_project_limit
      ], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async canUserPost(userId) {
    const user = await this.getUserById(userId);
    if (!user) return { canPost: false, message: "المستخدم غير موجود" };
    if (user.role === 'admin' || user.role === 'moderator') {
      return { canPost: true, message: "المشرفون ليس لهم حدود" };
    }

    const settings = await this.getForumSettings();
    const exception = await this.getUserException(userId);

    const dailyPostLimit = exception && exception.daily_post_limit !== null 
      ? exception.daily_post_limit 
      : parseInt(settings.daily_post_limit || 10);

    const query = `
      SELECT COUNT(*) as today_posts 
      FROM postsforum 
      WHERE user_id = ? AND DATE(created_at) = CURDATE()
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) reject(err);
        const todayPosts = results[0].today_posts;
        if (todayPosts >= dailyPostLimit) {
          resolve({ canPost: false, message: `لقد تجاوزت الحد اليومي للمنشورات (${dailyPostLimit})` });
        } else {
          resolve({ canPost: true, message: `يمكنك النشر (${todayPosts}/${dailyPostLimit} اليوم)` });
        }
      });
    });
  }

  static async canUserComment(userId) {
    const user = await this.getUserById(userId);
    if (!user) return { canComment: false, message: "المستخدم غير موجود" };
    if (user.role === 'admin' || user.role === 'moderator') {
      return { canComment: true, message: "المشرفون ليس لهم حدود" };
    }

    const settings = await this.getForumSettings();
    const exception = await this.getUserException(userId);

    const dailyCommentLimit = exception && exception.daily_comment_limit !== null 
      ? exception.daily_comment_limit 
      : parseInt(settings.daily_comment_limit || 20);

    const query = `
      SELECT COUNT(*) as today_comments 
      FROM commentsforum 
      WHERE user_id = ? AND DATE(created_at) = CURDATE()
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) reject(err);
        const todayComments = results[0].today_comments;
        if (todayComments >= dailyCommentLimit) {
          resolve({ canComment: false, message: `لقد تجاوزت الحد اليومي للتعليقات (${dailyCommentLimit})` });
        } else {
          resolve({ canComment: true, message: `يمكنك التعليق (${todayComments}/${dailyCommentLimit} اليوم)` });
        }
      });
    });
  }

  static async canUserAddAd(userId) {
    const user = await this.getUserById(userId);
    if (!user) return { canAddAd: false, message: "المستخدم غير موجود" };
    if (user.role === 'admin' || user.role === 'moderator') {
      return { canAddAd: true, message: "المشرفون ليس لهم حدود" };
    }

    const settings = await this.getForumSettings();
    const exception = await this.getUserException(userId);

    const dailyAdLimit = exception && exception.daily_ad_limit !== null 
      ? exception.daily_ad_limit 
      : parseInt(settings.daily_ad_limit || 5);

    const query = `
      SELECT COUNT(*) as today_ads 
      FROM ads 
      WHERE user_id = ? AND DATE(created_at) = CURDATE()
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) reject(err);
        const todayAds = results[0].today_ads;
        if (todayAds >= dailyAdLimit) {
          resolve({ canAddAd: false, message: `لقد تجاوزت الحد اليومي للإعلانات (${dailyAdLimit})` });
        } else {
          resolve({ canAddAd: true, message: `يمكنك إضافة إعلان (${todayAds}/${dailyAdLimit} اليوم)` });
        }
      });
    });
  }

  static async canUserLike(userId) {
    const user = await this.getUserById(userId);
    if (!user) return { canLike: false, message: "المستخدم غير موجود" };
    if (user.role === 'admin' || user.role === 'moderator') {
      return { canLike: true, message: "المشرفون ليس لهم حدود" };
    }

    const settings = await this.getForumSettings();
    const exception = await this.getUserException(userId);

    const dailyLikeLimit = exception && exception.daily_like_limit !== null 
      ? exception.daily_like_limit 
      : parseInt(settings.daily_like_limit || 100);

    const query = `
      SELECT COUNT(*) as today_likes 
      FROM likes 
      WHERE user_id = ? AND DATE(created_at) = CURDATE()
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) reject(err);
        const todayLikes = results[0].today_likes;
        if (todayLikes >= dailyLikeLimit) {
          resolve({ canLike: false, message: `لقد تجاوزت الحد اليومي للإعجابات (${dailyLikeLimit})` });
        } else {
          resolve({ canLike: true, message: `يمكنك الإعجاب (${todayLikes}/${dailyLikeLimit} اليوم)` });
        }
      });
    });
  }

  static async canUserAddJob(userId) {
    const user = await this.getUserById(userId);
    if (!user) return { canAddJob: false, message: "المستخدم غير موجود" };
    if (user.role === 'admin' || user.role === 'moderator') {
      return { canAddJob: true, message: "المشرفون ليس لهم حدود" };
    }

    const settings = await this.getForumSettings();
    const exception = await this.getUserException(userId);

    const dailyJobLimit = exception && exception.daily_job_limit !== null 
      ? exception.daily_job_limit 
      : parseInt(settings.daily_job_limit || 3);

    const query = `
      SELECT COUNT(*) as today_jobs 
      FROM jobs 
      WHERE user_id = ? AND DATE(created_at) = CURDATE()
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) reject(err);
        const todayJobs = results[0].today_jobs;
        if (todayJobs >= dailyJobLimit) {
          resolve({ canAddJob: false, message: `لقد تجاوزت الحد اليومي لإضافة الوظائف (${dailyJobLimit})` });
        } else {
          resolve({ canAddJob: true, message: `يمكنك إضافة وظيفة (${todayJobs}/${dailyJobLimit} اليوم)` });
        }
      });
    });
  }

  static async canUserAddProject(userId) {
    const user = await this.getUserById(userId);
    if (!user) return { canAddProject: false, message: "المستخدم غير موجود" };
    if (user.role === 'admin' || user.role === 'moderator') {
      return { canAddProject: true, message: "المشرفون ليس لهم حدود" };
    }

    const settings = await this.getForumSettings();
    const exception = await this.getUserException(userId);

    const dailyProjectLimit = exception && exception.daily_project_limit !== null 
      ? exception.daily_project_limit 
      : parseInt(settings.daily_project_limit || 3);

    const query = `
      SELECT COUNT(*) as today_projects 
      FROM projects 
      WHERE user_id = ? AND DATE(created_at) = CURDATE()
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) reject(err);
        const todayProjects = results[0].today_projects;
        if (todayProjects >= dailyProjectLimit) {
          resolve({ canAddProject: false, message: `لقد تجاوزت الحد اليومي لإضافة المشاريع (${dailyProjectLimit})` });
        } else {
          resolve({ canAddProject: true, message: `يمكنك إضافة مشروع (${todayProjects}/${dailyProjectLimit} اليوم)` });
        }
      });
    });
  }

  static async getUserException(userId) {
    const query = `
      SELECT daily_post_limit, daily_comment_limit, daily_ad_limit, daily_like_limit, daily_job_limit, daily_project_limit
      FROM forum_exceptions
      WHERE user_id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0] || null);
      });
    });
  }

  static async deleteOldAds() {
    const settings = await this.getForumSettings();
    const adExpiryDays = parseInt(settings.ad_expiry_days || 30);

    const query = `
      DELETE FROM ads 
      WHERE created_at < NOW() - INTERVAL ? DAY
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [adExpiryDays], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getAllRoles() {
    const query = "SELECT * FROM roles";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async getAllPermissions() {
    const query = "SELECT * FROM permissions";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async getAdmins() {
    const query = `
      SELECT u.id, u.name, u.email, u.role, r.id AS role_id, r.name AS role_name, r.title AS role_title
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.role IN ('admin', 'moderator', 'editor')
    `;
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async getUserPermissions(roleId) {
    const query = `
      SELECT p.id, p.permission AS name, p.can_edit_users
      FROM permissions p
      WHERE p.role_id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [roleId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async addRole(name, title, description) {
    const query = "INSERT INTO roles (name, title, description) VALUES (?, ?, ?)";
    return new Promise((resolve, reject) => {
      db.query(query, [name, title, description], (err, result) => {
        if (err) reject(err);
        else resolve(result.insertId);
      });
    });
  }

  static async addPermission(roleId, permission, canEditUsers) {
    const query = "INSERT INTO permissions (role_id, permission, can_edit_users) VALUES (?, ?, ?)";
    return new Promise((resolve, reject) => {
      db.query(query, [roleId, permission, canEditUsers ? 1 : 0], (err, result) => {
        if (err) reject(err);
        else resolve(result.insertId);
      });
    });
  }

  static async assignRoleToUser(userId, roleId) {
    const query = "UPDATE users SET role_id = ? WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [roleId, userId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async removePermission(permissionId) {
    const query = "DELETE FROM permissions WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [permissionId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}

module.exports = NotificationModel;