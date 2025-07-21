const StoreModel = require("../models/StoreModel");

class StoreMiddleware {
  /**
   * التحقق من ملكية المتجر
   */
  static async checkStoreOwnership(req, res, next) {
    try {
      const { storeId } = req.params;
      if (!req.user) {
        if (req.xhr || (req.headers['content-type'] && req.headers['content-type'].includes('application/json'))) {
          return res.status(401).json({ success: false, message: "يجب تسجيل الدخول أولاً" });
        }
        return res.redirect('/login?alert=login_required');
      }
      const userId = req.user.id;
      const isOwner = await StoreModel.isStoreOwner(storeId, userId);
      if (!isOwner) {
        if (req.xhr || (req.headers['content-type'] && req.headers['content-type'].includes('application/json'))) {
          return res.status(403).json({
            success: false,
            message: "غير مصرح لك بالوصول لهذا المتجر"
          });
        }
        return res.redirect('/login?alert=login_required');
      }
      next();
    } catch (error) {
      console.error("خطأ في التحقق من ملكية المتجر:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم"
      });
    }
  }

  /**
   * التحقق من ملكية المنتج
   */
  static async checkProductOwnership(req, res, next) {
    try {
      const { productId } = req.params;
      if (!req.user) {
        if (req.xhr || (req.headers['content-type'] && req.headers['content-type'].includes('application/json'))) {
          return res.status(401).json({ success: false, message: "يجب تسجيل الدخول أولاً" });
        }
        return res.redirect('/login?alert=login_required');
      }
      const userId = req.user.id;
      const product = await StoreModel.getProductById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "المنتج غير موجود"
        });
      }
      if (product.store_owner_id !== userId) {
        if (req.xhr || (req.headers['content-type'] && req.headers['content-type'].includes('application/json'))) {
          return res.status(403).json({
            success: false,
            message: "غير مصرح لك بتعديل هذا المنتج"
          });
        }
        return res.redirect('/login?alert=login_required');
      }
      req.product = product;
      next();
    } catch (error) {
      console.error("خطأ في التحقق من ملكية المنتج:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم"
      });
    }
  }

  /**
   * التحقق من صلاحيات الأدمن
   */
  static requireAdmin(req, res, next) {
    if (!req.user || !req.user.isAdmin) {
      if (req.xhr || (req.headers['content-type'] && req.headers['content-type'].includes('application/json'))) {
        return res.status(403).json({
          success: false,
          message: "غير مصرح لك بالوصول - صلاحيات أدمن مطلوبة"
        });
      }
      return res.redirect('/login?alert=login_required');
    }
    next();
  }

  /**
   * التحقق من تسجيل الدخول
   */
  static requireAuth(req, res, next) {
    if (!req.user) {
      if (req.xhr || (req.headers['content-type'] && req.headers['content-type'].includes('application/json'))) {
        return res.status(401).json({
          success: false,
          message: "يجب تسجيل الدخول أولاً"
        });
      }
      return res.redirect('/login?alert=login_required');
    }
    next();
  }

  /**
   * التحقق من حد المنتجات لكل متجر
   */
  static async checkProductLimit(req, res, next) {
    try {
      const { storeId } = req.params;
      const MAX_PRODUCTS_PER_STORE = 100; // حد أقصى 100 منتج لكل متجر

      const stats = await StoreModel.getStoreStats(storeId);
      if (stats.total_products >= MAX_PRODUCTS_PER_STORE) {
        return res.status(400).json({
          success: false,
          message: `لا يمكن إضافة أكثر من ${MAX_PRODUCTS_PER_STORE} منتج في المتجر الواحد`
        });
      }

      next();
    } catch (error) {
      console.error("خطأ في التحقق من حد المنتجات:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم"
      });
    }
  }

  /**
   * التحقق من حد طلبات المتاجر لكل مستخدم
   */
  static async checkStoreRequestLimit(req, res, next) {
    try {
      const userId = req.user.id;

      // التحقق من وجود طلب معلق
      const hasPendingRequest = await StoreModel.hasPendingStoreRequest(userId);
      if (hasPendingRequest) {
        return res.status(400).json({
          success: false,
          message: "لديك طلب متجر معلق بالفعل"
        });
      }

      // التحقق من عدد المتاجر المملوكة (حد أقصى 3 متاجر لكل مستخدم)
      const userStores = await StoreModel.getUserStores(userId);
      const MAX_STORES_PER_USER = 3;
      
      if (userStores.length >= MAX_STORES_PER_USER) {
        return res.status(400).json({
          success: false,
          message: `لا يمكن إنشاء أكثر من ${MAX_STORES_PER_USER} متاجر لكل مستخدم`
        });
      }

      next();
    } catch (error) {
      console.error("خطأ في التحقق من حد طلبات المتاجر:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم"
      });
    }
  }

  /**
   * تنظيف وتحقق من البيانات المدخلة
   */
  static validateStoreData(req, res, next) {
    const { storeName, storeDescription } = req.body;

    // تنظيف البيانات
    if (storeName) {
      req.body.storeName = storeName.trim();
    }
    if (storeDescription) {
      req.body.storeDescription = storeDescription.trim();
    }

    // التحقق من الطول
    if (req.body.storeName && req.body.storeName.length > 255) {
      return res.status(400).json({
        success: false,
        message: "اسم المتجر طويل جداً (الحد الأقصى 255 حرف)"
      });
    }

    if (req.body.storeDescription && req.body.storeDescription.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "وصف المتجر طويل جداً (الحد الأقصى 1000 حرف)"
      });
    }

    next();
  }

  /**
   * تنظيف وتحقق من بيانات المنتج
   */
  static validateProductData(req, res, next) {
    const { name, description, price } = req.body;

    // تنظيف البيانات
    if (name) {
      req.body.name = name.trim();
    }
    if (description) {
      req.body.description = description.trim();
    }

    // التحقق من الطول
    if (req.body.name && req.body.name.length > 255) {
      return res.status(400).json({
        success: false,
        message: "اسم المنتج طويل جداً (الحد الأقصى 255 حرف)"
      });
    }

    if (req.body.description && req.body.description.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "وصف المنتج طويل جداً (الحد الأقصى 2000 حرف)"
      });
    }

    // التحقق من السعر
    if (price !== undefined) {
      const numPrice = parseFloat(price);
      if (isNaN(numPrice) || numPrice < 0) {
        return res.status(400).json({
          success: false,
          message: "السعر يجب أن يكون رقماً موجباً"
        });
      }
      if (numPrice > 999999.99) {
        return res.status(400).json({
          success: false,
          message: "السعر مرتفع جداً"
        });
      }
      req.body.price = numPrice;
    }

    next();
  }

  /**
   * معدل الطلبات (Rate Limiting)
   */
  static rateLimitStoreRequests(req, res, next) {
    // تنفيذ بسيط لمعدل الطلبات
    // في بيئة الإنتاج، يُفضل استخدام Redis أو مكتبة مخصصة
    const userRequests = global.storeRequestsCache || {};
    const userId = req.user.id;
    const now = Date.now();
    const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // ساعة واحدة
    const MAX_REQUESTS_PER_HOUR = 5;

    if (!userRequests[userId]) {
      userRequests[userId] = [];
    }

    // إزالة الطلبات القديمة
    userRequests[userId] = userRequests[userId].filter(
      timestamp => now - timestamp < RATE_LIMIT_WINDOW
    );

    if (userRequests[userId].length >= MAX_REQUESTS_PER_HOUR) {
      return res.status(429).json({
        success: false,
        message: "تم تجاوز الحد المسموح من الطلبات. حاول مرة أخرى لاحقاً"
      });
    }

    userRequests[userId].push(now);
    global.storeRequestsCache = userRequests;

    next();
  }
}

module.exports = StoreMiddleware;

