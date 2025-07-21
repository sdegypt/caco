const db = require("../config/db");

class StoreModel {
  // ===== طلبات إنشاء المتاجر =====
  
  /**
   * إنشاء طلب متجر جديد
   */
  static async createStoreRequest(userId, storeName, storeDescription) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO store_requests (user_id, store_name, store_description, status) 
        VALUES (?, ?, ?, 'pending')
      `;
      db.query(query, [userId, storeName, storeDescription], (error, results) => {
        if (error) return reject(error);
        resolve(results.insertId);
      });
    });
  }

  /**
   * الحصول على طلبات المتاجر حسب الحالة
   */
  static async getStoreRequestsByStatus(status = null) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT sr.*, u.name as user_name, u.email as user_email 
        FROM store_requests sr 
        JOIN users u ON sr.user_id = u.id
      `;
      let params = [];
      
      if (status) {
        query += " WHERE sr.status = ?";
        params.push(status);
      }
      
      query += " ORDER BY sr.created_at DESC";
      
      db.query(query, params, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  /**
   * الحصول على طلب متجر بواسطة ID
   */
  static async getStoreRequestById(requestId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT sr.*, u.name as user_name, u.email as user_email 
        FROM store_requests sr 
        JOIN users u ON sr.user_id = u.id 
        WHERE sr.id = ?
      `;
      db.query(query, [requestId], (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  }

  /**
   * تحديث حالة طلب المتجر
   */
  static async updateStoreRequestStatus(requestId, status, adminId, adminNotes = null) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE store_requests 
        SET status = ?, processed_by = ?, admin_notes = ?, processed_at = NOW() 
        WHERE id = ?
      `;
      db.query(query, [status, adminId, adminNotes, requestId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  /**
   * التحقق من وجود طلب متجر معلق للمستخدم
   */
  static async hasPendingStoreRequest(userId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT id FROM store_requests WHERE user_id = ? AND status = 'pending'";
      db.query(query, [userId], (error, results) => {
        if (error) return reject(error);
        resolve(results.length > 0);
      });
    });
  }

  // ===== إدارة المتاجر =====

  /**
   * إنشاء متجر جديد (بعد الموافقة على الطلب)
   */
  static async createStore(userId, name, description, coverImage = null, whatsappNumber = null, currency = 'SAR') {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO stores (user_id, name, description, status, cover_image, whatsapp_number, currency) 
        VALUES (?, ?, ?, 'approved', ?, ?, ?)
      `;
      db.query(query, [userId, name, description, coverImage, whatsappNumber, currency], (error, results) => {
        if (error) return reject(error);
        resolve(results.insertId);
      });
    });
  }

  /**
   * الحصول على جميع المتاجر المعتمدة
   */
  static async getAllApprovedStores() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT s.*, u.name as owner_name, 
               COUNT(p.id) as products_count
        FROM stores s 
        JOIN users u ON s.user_id = u.id 
        LEFT JOIN products p ON s.id = p.store_id AND p.status = 'active'
        WHERE s.status = 'approved' 
        GROUP BY s.id
        ORDER BY s.created_at DESC
      `;
      db.query(query, [], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  /**
   * الحصول على متجر بواسطة ID
   */
  static async getStoreById(storeId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT s.*, u.name as owner_name, u.email as owner_email 
        FROM stores s 
        JOIN users u ON s.user_id = u.id 
        WHERE s.id = ?
      `;
      db.query(query, [storeId], (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  }

  /**
   * الحصول على متاجر المستخدم
   */
  static async getUserStores(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT s.*, COUNT(p.id) as products_count
        FROM stores s 
        LEFT JOIN products p ON s.id = p.store_id AND p.status = 'active'
        WHERE s.user_id = ? 
        GROUP BY s.id
        ORDER BY s.created_at DESC
      `;
      db.query(query, [userId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  /**
   * تحديث معلومات المتجر
   */
  static async updateStore(storeId, name, description, coverImage = null, whatsappNumber = null, currency = 'SAR') {
    return new Promise((resolve, reject) => {
      let query = "UPDATE stores SET name = ?, description = ?";
      let params = [name, description];
      if (coverImage) {
        query += ", cover_image = ?";
        params.push(coverImage);
      }
      if (whatsappNumber !== null) {
        query += ", whatsapp_number = ?";
        params.push(whatsappNumber);
      }
      if (currency !== null) {
        query += ", currency = ?";
        params.push(currency);
      }
      query += " WHERE id = ?";
      params.push(storeId);
      db.query(query, params, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  /**
   * حذف متجر
   */
  static async deleteStore(storeId) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM stores WHERE id = ?";
      db.query(query, [storeId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  /**
   * التحقق من ملكية المتجر
   */
  static async isStoreOwner(storeId, userId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT id FROM stores WHERE id = ? AND user_id = ?";
      db.query(query, [storeId, userId], (error, results) => {
        if (error) return reject(error);
        resolve(results.length > 0);
      });
    });
  }

  // ===== إدارة المنتجات =====

  /**
   * إضافة منتج جديد
   */
  static async addProduct(storeId, name, description, price, currency) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO products (store_id, name, description, price, currency, status) 
        VALUES (?, ?, ?, ?, ?, 'active')
      `;
      db.query(query, [storeId, name, description, price, currency], (error, results) => {
        if (error) return reject(error);
        resolve(results.insertId);
      });
    });
  }

  /**
   * الحصول على منتجات المتجر
   */
  static async getStoreProducts(storeId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, 
               GROUP_CONCAT(pi.image_path) as images,
               (SELECT pi2.image_path FROM product_images pi2 WHERE pi2.product_id = p.id AND pi2.is_primary = 1 LIMIT 1) as primary_image
        FROM products p 
        LEFT JOIN product_images pi ON p.id = pi.product_id 
        WHERE p.store_id = ? AND p.status = 'active'
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `;
      db.query(query, [storeId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  /**
   * الحصول على منتج بواسطة ID
   */
  static async getProductById(productId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, s.name as store_name, s.user_id as store_owner_id,
               GROUP_CONCAT(pi.image_path) as images
        FROM products p 
        JOIN stores s ON p.store_id = s.id
        LEFT JOIN product_images pi ON p.id = pi.product_id 
        WHERE p.id = ?
        GROUP BY p.id
      `;
      db.query(query, [productId], (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  }

  /**
   * تحديث منتج
   */
  static async updateProduct(productId, name, description, price) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE products 
        SET name = ?, description = ?, price = ? 
        WHERE id = ?
      `;
      db.query(query, [name, description, price, productId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  /**
   * حذف منتج
   */
  static async deleteProduct(productId) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM products WHERE id = ?";
      db.query(query, [productId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  /**
   * تغيير حالة المنتج
   */
  static async toggleProductStatus(productId) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE products 
        SET status = CASE WHEN status = 'active' THEN 'inactive' ELSE 'active' END 
        WHERE id = ?
      `;
      db.query(query, [productId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  // ===== إدارة صور المنتجات =====

  /**
   * إضافة صورة للمنتج
   */
  static async addProductImage(productId, imagePath, isPrimary = false) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO product_images (product_id, image_path, image_url, is_primary) 
        VALUES (?, ?, ?, ?)
      `;
      db.query(query, [productId, imagePath, imagePath, isPrimary], (error, results) => {
        if (error) return reject(error);
        resolve(results.insertId);
      });
    });
  }

  /**
   * الحصول على صور المنتج
   */
  static async getProductImages(productId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM product_images 
        WHERE product_id = ? 
        ORDER BY is_primary DESC, created_at ASC
      `;
      db.query(query, [productId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  /**
   * حذف صورة المنتج
   */
  static async deleteProductImage(imageId) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM product_images WHERE id = ?";
      db.query(query, [imageId], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }

  /**
   * تعيين صورة كصورة رئيسية
   */
  static async setPrimaryImage(productId, imageId) {
    return new Promise((resolve, reject) => {
      // أولاً إزالة الصورة الرئيسية الحالية
      const resetQuery = "UPDATE product_images SET is_primary = 0 WHERE product_id = ?";
      db.query(resetQuery, [productId], (error) => {
        if (error) return reject(error);
        
        // ثم تعيين الصورة الجديدة كرئيسية
        const setPrimaryQuery = "UPDATE product_images SET is_primary = 1 WHERE id = ? AND product_id = ?";
        db.query(setPrimaryQuery, [imageId, productId], (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });
    });
  }

  // ===== إحصائيات =====

  /**
   * الحصول على إحصائيات المتجر
   */
  static async getStoreStats(storeId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          COUNT(p.id) as total_products,
          COUNT(CASE WHEN p.status = 'active' THEN 1 END) as active_products,
          COUNT(CASE WHEN p.status = 'inactive' THEN 1 END) as inactive_products,
          AVG(p.price) as average_price,
          MIN(p.price) as min_price,
          MAX(p.price) as max_price
        FROM products p 
        WHERE p.store_id = ?
      `;
      db.query(query, [storeId], (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  }

  /**
   * الحصول على إحصائيات عامة للنظام
   */
  static async getSystemStats() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          (SELECT COUNT(*) FROM stores WHERE status = 'approved') as total_stores,
          (SELECT COUNT(*) FROM store_requests WHERE status = 'pending') as pending_requests,
          (SELECT COUNT(*) FROM products WHERE status = 'active') as total_products,
          (SELECT COUNT(DISTINCT user_id) FROM stores WHERE status = 'approved') as store_owners
      `;
      db.query(query, [], (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  }
}

module.exports = StoreModel;

