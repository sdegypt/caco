const db = require("../config/db");

class JobModel {
  static async addJob(jobData) {
    const sql = `
      INSERT INTO jobs 
      (title, description, job_type, education, currency, salary_min, salary_max, salary_after_interview, location, experience, duration, logo, expires_at, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      jobData.title,
      jobData.description,
      jobData.job_type,
      jobData.education,
      jobData.currency || null,
      jobData.salary_min || null,
      jobData.salary_max || null,
      jobData.salary_after_interview || 0,
      jobData.location,
      jobData.experience,
      jobData.duration || null,
      jobData.logo || null,
      jobData.expires_at || null,
      jobData.user_id || null,
    ];

    return new Promise((resolve, reject) => {
      db.query(sql, values, (err, results) => {
        if (err) reject(err);
        else resolve(results.insertId);
      });
    });
  }

  static async getAllJobs() {
    const sql = `
      SELECT 
        j.job_id, j.title, j.description, j.job_type, j.education, j.currency, 
        j.salary_min, j.salary_max, j.salary_after_interview, j.logo,
        j.location, j.experience, j.duration, j.created_at, j.expires_at, j.user_id,
        u.name AS user_name, u.avatar AS user_avatar
      FROM jobs j
      LEFT JOIN users u ON j.user_id = u.id
      WHERE j.expires_at IS NULL OR j.expires_at > NOW()
      ORDER BY j.created_at DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async addApplication(jobId, applicantId, coverLetter) {
    try {
      const existingApplication = await this.checkExistingApplication(jobId, applicantId);
      if (existingApplication) {
        throw new Error("لقد تقدمت لهذه الوظيفة بالفعل");
      }

      const jobExists = await this.getJobDetail(jobId);
      if (!jobExists) {
        throw new Error("الوظيفة غير موجودة");
      }

      const sql = `
        INSERT INTO job_applications 
        (job_id, applicant_id, cover_letter) 
        VALUES (?, ?, ?)
      `;
      return new Promise((resolve, reject) => {
        db.query(sql, [jobId, applicantId, coverLetter], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
    } catch (error) {
      throw error;
    }
  }

  static checkExistingApplication(jobId, applicantId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM job_applications 
        WHERE job_id = ? AND applicant_id = ?
      `;
      db.query(query, [jobId, applicantId], (err, results) => {
        if (err) reject(err);
        else resolve(results.length > 0);
      });
    });
  }

  static async getApplicationsByJob(jobId) {
    const sql = `
      SELECT 
        ja.application_id, ja.job_id, ja.applicant_id, ja.cover_letter, ja.created_at,
        j.title AS job_title,
        u.name AS applicant_name, u.avatar AS applicant_avatar, u.email AS applicant_email
      FROM job_applications ja
      LEFT JOIN jobs j ON ja.job_id = j.job_id
      LEFT JOIN users u ON ja.applicant_id = u.id
      WHERE ja.job_id = ?
      ORDER BY ja.created_at DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [jobId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async getAllApplicationsForOwner(ownerId) {
    const sql = `
      SELECT 
        ja.application_id, ja.job_id, ja.applicant_id, ja.cover_letter, ja.created_at,
        j.title AS job_title,
        u.name AS applicant_name, u.avatar AS applicant_avatar, u.email AS applicant_email
      FROM job_applications ja
      LEFT JOIN jobs j ON ja.job_id = j.job_id
      LEFT JOIN users u ON ja.applicant_id = u.id
      WHERE j.user_id = ?
      ORDER BY ja.created_at DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [ownerId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async getAllApplications() {
    const sql = `
      SELECT 
        ja.application_id, ja.job_id, ja.applicant_id, ja.cover_letter, ja.created_at,
        j.title AS job_title, j.location AS job_location,
        u.name AS applicant_name, u.avatar AS applicant_avatar, u.email AS applicant_email
      FROM job_applications ja
      LEFT JOIN jobs j ON ja.job_id = j.job_id
      LEFT JOIN users u ON ja.applicant_id = u.id
      ORDER BY ja.created_at DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async deleteApplication(applicationId) {
    const sql = `DELETE FROM job_applications WHERE application_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [applicationId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async getJobDetail(jobId) {
    const sql = `
      SELECT 
        j.*, 
        u.name AS user_name, u.avatar AS user_avatar
      FROM jobs j
      LEFT JOIN users u ON j.user_id = u.id
      WHERE j.job_id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [jobId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  static async getUserProfile(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT name, avatar 
        FROM users 
        WHERE id = ?
      `;
      db.query(query, [userId], (err, results) => {
        if (err) reject(err);
        else {
          const user = results[0];
          user.avatar = user.avatar && user.avatar.startsWith('http') ? user.avatar : '/uploads/images/pngwing.com.png';
          resolve(user);
        }
      });
    });
  }
}

module.exports = JobModel;