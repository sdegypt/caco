const StoreModel = require("../models/StoreModel");
const path = require("path");
const fs = require("fs");

class StoreController {
  // ===== طلبات إنشاء المتاجر =====

  /**
   * إنشاء طلب متجر جديد
   */
  static async requestStore(req, res) {
    try {
      const { storeName, storeDescription } = req.body;
      const userId = req.user.id;

      // التحقق من البيانات المطلوبة
      if (!storeName || !storeDescription) {
        return res.status(400).json({
          success: false,
          message: "اسم المتجر والوصف مطلوبان"
        });
      }

      // التحقق من عدم وجود طلب معلق للمستخدم
      const hasPendingRequest = await StoreModel.hasPendingStoreRequest(userId);
      if (hasPendingRequest) {
        return res.status(400).json({
          success: false,
          message: "لديك طلب متجر معلق بالفعل"
        });
      }

      // إنشاء الطلب
      const requestId = await StoreModel.createStoreRequest(userId, storeName, storeDescription);

      res.status(201).json({
        success: true,
        message: "تم إرسال طلب إنشاء المتجر بنجاح",
        requestId: requestId
      });

    } catch (error) {
      console.error("خطأ في إنشاء طلب المتجر:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم"
      });
    }
  }

  /**
   * الحصول على طلبات المتاجر (للأدمن)
   */
  static async getStoreRequests(req, res) {
    try {
      const { status } = req.query;
      const requests = await StoreModel.getStoreRequestsByStatus(status);

      res.json({
        success: true,
        requests: requests
      });

    } catch (error) {
      console.error("خطأ في جلب طلبات المتاجر:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم"
      });
    }
  }

  /**
   * الموافقة على طلب متجر أو رفضه (للأدمن)
   */
  static async processStoreRequest(req, res) {
    try {
      const { requestId } = req.params;
      const { action, adminNotes } = req.body; // action: 'approve' or 'reject'
      const adminId = req.user.id;

      // التحقق من صحة العملية
      if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({
          success: false,
          message: "عملية غير صحيحة"
        });
      }

      // الحصول على تفاصيل الطلب
      const request = await StoreModel.getStoreRequestById(requestId);
      if (!request) {
        return res.status(404).json({
          success: false,
          message: "الطلب غير موجود"
        });
      }

      if (request.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: "تم معالجة هذا الطلب مسبقاً"
        });
      }

      const status = action === 'approve' ? 'approved' : 'rejected';

      // تحديث حالة الطلب
      await StoreModel.updateStoreRequestStatus(requestId, status, adminId, adminNotes);

      // إذا تمت الموافقة، إنشاء المتجر
      if (action === 'approve') {
        await StoreModel.createStore(
          request.user_id,
          request.store_name,
          request.store_description
        );
      }

      res.json({
        success: true,
        message: action === 'approve' ? "تمت الموافقة على المتجر" : "تم رفض الطلب"
      });

    } catch (error) {
      console.error("خطأ في معالجة طلب المتجر:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم"
      });
    }
  }

  // ===== إدارة المتاجر =====

  /**
   * عرض جميع المتاجر المعتمدة
   */
  static async listStores(req, res) {
    try {
      const stores = await StoreModel.getAllApprovedStores();

      res.render('stores', {
        title: 'المتاجر',
        stores: stores,
        user: req.user
      });

    } catch (error) {
      console.error("خطأ في جلب المتاجر:", error);
      res.status(500).render('404', {
        message: "حدث خطأ في جلب المتاجر"
      });
    }
  }

  /**
   * عرض صفحة متجر محدد
   */
  static async getStorePage(req, res) {
    try {
      const { storeId } = req.params;

      // الحصول على تفاصيل المتجر
      const store = await StoreModel.getStoreById(storeId);
      if (!store || store.status !== 'approved') {
        return res.status(404).render('404', {
          message: "المتجر غير موجود"
        });
      }

      // الحصول على منتجات المتجر
      const products = await StoreModel.getStoreProducts(storeId);

      // الحصول على إحصائيات المتجر
      const stats = await StoreModel.getStoreStats(storeId);

      res.render('store', {
        title: store.name,
        store: store,
        products: products,
        stats: stats,
        user: req.user,
        req
      });

    } catch (error) {
      console.error("خطأ في جلب صفحة المتجر:", error);
      res.status(500).render('404', {
        message: "حدث خطأ في جلب المتجر"
      });
    }
  }

  /**
   * لوحة تحكم المتجر (للمالك)
   */
  static async getStoreDashboard(req, res) {
    try {
      const { storeId } = req.params;
      const userId = req.user.id;

      // التحقق من ملكية المتجر
      const isOwner = await StoreModel.isStoreOwner(storeId, userId);
      if (!isOwner) {
        return res.status(403).render('404', {
          message: "غير مصرح لك بالوصول لهذا المتجر"
        });
      }

      // الحصول على تفاصيل المتجر
      const store = await StoreModel.getStoreById(storeId);
      const products = await StoreModel.getStoreProducts(storeId);
      const stats = await StoreModel.getStoreStats(storeId);

      res.render('store-dashboard', {
        title: `إدارة متجر ${store.name}`,
        store: store,
        products: products,
        stats: stats,
        user: req.user
      });

    } catch (error) {
      console.error("خطأ في جلب لوحة تحكم المتجر:", error);
      res.status(500).render('404', {
        message: "حدث خطأ في جلب لوحة التحكم"
      });
    }
  }

  /**
   * تحديث معلومات المتجر
   */
  static async updateStore(req, res) {
    try {
      const { storeId } = req.params;
      const { name, description, whatsapp_number, currency } = req.body;
      const userId = req.user.id;

      // التحقق من ملكية المتجر
      const isOwner = await StoreModel.isStoreOwner(storeId, userId);
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: "غير مصرح لك بتعديل هذا المتجر"
        });
      }

      // معالجة صورة الغلاف إن وجدت (Cloudinary أو محلي)
      let coverImage = null;
      if (req.file) {
        // Cloudinary multer-storage-cloudinary يوفر url أو path
        coverImage = req.file.url || req.file.path || req.file.filename || null;
      }

      // تحديث المتجر
      await StoreModel.updateStore(storeId, name, description, coverImage, whatsapp_number, currency);

      res.json({
        success: true,
        message: "تم تحديث المتجر بنجاح"
      });

    } catch (error) {
      console.error("خطأ في تحديث المتجر:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم"
      });
    }
  }

  // ===== إدارة المنتجات =====

  /**
   * إضافة منتج جديد
   */
  static async addProduct(req, res) {
    try {
      const { storeId } = req.params;
      const { name, description, price, currency } = req.body;
      const userId = req.user.id;

      // التحقق من ملكية المتجر
      const isOwner = await StoreModel.isStoreOwner(storeId, userId);
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: "غير مصرح لك بإضافة منتجات لهذا المتجر"
        });
      }

      // التحقق من البيانات
      if (!name || !description || !price) {
        return res.status(400).json({
          success: false,
          message: "جميع البيانات مطلوبة"
        });
      }

      // جلب عملة المتجر إذا لم تُرسل عملة
      let productCurrency = currency;
      if (!productCurrency) {
        const store = await StoreModel.getStoreById(storeId);
        productCurrency = store && store.currency ? store.currency : 'SAR';
      }

      // إضافة المنتج
      const productId = await StoreModel.addProduct(storeId, name, description, parseFloat(price), productCurrency);

      // معالجة الصور إن وجدت (Cloudinary أو محلي)
      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          let imagePath = req.files[i].url || req.files[i].path || req.files[i].filename || null;
          const isPrimary = i === 0;
          await StoreModel.addProductImage(productId, imagePath, isPrimary);
        }
      }

      res.status(201).json({
        success: true,
        message: "تم إضافة المنتج بنجاح",
        productId: productId
      });

    } catch (error) {
      console.error("خطأ في إضافة المنتج:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم"
      });
    }
  }

  /**
   * تحديث منتج
   */
  static async updateProduct(req, res) {
    try {
      const { productId } = req.params;
      const { name, description, price } = req.body;
      const userId = req.user.id;

      // الحصول على تفاصيل المنتج للتحقق من الملكية
      const product = await StoreModel.getProductById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "المنتج غير موجود"
        });
      }

      if (product.store_owner_id !== userId) {
        return res.status(403).json({
          success: false,
          message: "غير مصرح لك بتعديل هذا المنتج"
        });
      }

      // تحديث المنتج
      await StoreModel.updateProduct(productId, name, description, parseFloat(price));

      res.json({
        success: true,
        message: "تم تحديث المنتج بنجاح"
      });

    } catch (error) {
      console.error("خطأ في تحديث المنتج:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم"
      });
    }
  }

  /**
   * حذف منتج
   */
  static async deleteProduct(req, res) {
    try {
      const { productId } = req.params;
      const userId = req.user.id;

      // الحصول على تفاصيل المنتج للتحقق من الملكية
      const product = await StoreModel.getProductById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "المنتج غير موجود"
        });
      }

      if (product.store_owner_id !== userId) {
        return res.status(403).json({
          success: false,
          message: "غير مصرح لك بحذف هذا المنتج"
        });
      }

      // حذف صور المنتج من الخادم
      const images = await StoreModel.getProductImages(productId);
      for (const image of images) {
        const imagePath = path.join(__dirname, '..', 'public', image.image_path);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      // حذف المنتج من قاعدة البيانات
      await StoreModel.deleteProduct(productId);

      res.json({
        success: true,
        message: "تم حذف المنتج بنجاح"
      });

    } catch (error) {
      console.error("خطأ في حذف المنتج:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم"
      });
    }
  }

  /**
   * تغيير حالة المنتج (تفعيل/إلغاء تفعيل)
   */
  static async toggleProductStatus(req, res) {
    try {
      const { productId } = req.params;
      const userId = req.user.id;

      // التحقق من الملكية
      const product = await StoreModel.getProductById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "المنتج غير موجود"
        });
      }

      if (product.store_owner_id !== userId) {
        return res.status(403).json({
          success: false,
          message: "غير مصرح لك بتعديل هذا المنتج"
        });
      }

      // تغيير الحالة
      await StoreModel.toggleProductStatus(productId);

      res.json({
        success: true,
        message: "تم تغيير حالة المنتج بنجاح"
      });

    } catch (error) {
      console.error("خطأ في تغيير حالة المنتج:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم"
      });
    }
  }

  // ===== إدارة صور المنتجات =====

  /**
   * إضافة صورة للمنتج
   */
  static async addProductImage(req, res) {
    try {
      const { productId } = req.params;
      const userId = req.user.id;

      // التحقق من الملكية
      const product = await StoreModel.getProductById(productId);
      if (!product || product.store_owner_id !== userId) {
        return res.status(403).json({
          success: false,
          message: "غير مصرح لك بتعديل هذا المنتج"
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "لم يتم رفع صورة"
        });
      }

      const imagePath = req.file.path;
      const imageId = await StoreModel.addProductImage(productId, imagePath, false);

      res.json({
        success: true,
        message: "تم إضافة الصورة بنجاح",
        imageId: imageId,
        imagePath: imagePath
      });

    } catch (error) {
      console.error("خطأ في إضافة صورة المنتج:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم"
      });
    }
  }

  /**
   * حذف صورة المنتج
   */
  static async deleteProductImage(req, res) {
    try {
      const { imageId } = req.params;
      const userId = req.user.id;

      // الحصول على تفاصيل الصورة
      const images = await StoreModel.getProductImages(req.body.productId);
      const image = images.find(img => img.id == imageId);
      
      if (!image) {
        return res.status(404).json({
          success: false,
          message: "الصورة غير موجودة"
        });
      }

      // التحقق من الملكية
      const product = await StoreModel.getProductById(image.product_id);
      if (product.store_owner_id !== userId) {
        return res.status(403).json({
          success: false,
          message: "غير مصرح لك بحذف هذه الصورة"
        });
      }

      // حذف الصورة من الخادم
      const imagePath = path.join(__dirname, '..', 'public', image.image_path);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      // حذف الصورة من قاعدة البيانات
      await StoreModel.deleteProductImage(imageId);

      res.json({
        success: true,
        message: "تم حذف الصورة بنجاح"
      });

    } catch (error) {
      console.error("خطأ في حذف صورة المنتج:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم"
      });
    }
  }

  /**
   * تعيين صورة كصورة رئيسية
   */
  static async setPrimaryImage(req, res) {
    try {
      const { productId, imageId } = req.params;
      const userId = req.user.id;

      // التحقق من الملكية
      const product = await StoreModel.getProductById(productId);
      if (!product || product.store_owner_id !== userId) {
        return res.status(403).json({
          success: false,
          message: "غير مصرح لك بتعديل هذا المنتج"
        });
      }

      await StoreModel.setPrimaryImage(productId, imageId);

      res.json({
        success: true,
        message: "تم تعيين الصورة الرئيسية بنجاح"
      });

    } catch (error) {
      console.error("خطأ في تعيين الصورة الرئيسية:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم"
      });
    }
  }

  // ===== API للحصول على البيانات =====

  /**
   * الحصول على متاجر المستخدم
   */
  static async getUserStores(req, res) {
    try {
      const userId = req.user.id;
      const stores = await StoreModel.getUserStores(userId);

      res.json({
        success: true,
        stores: stores
      });

    } catch (error) {
      console.error("خطأ في جلب متاجر المستخدم:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم"
      });
    }
  }

  /**
   * الحصول على إحصائيات النظام (للأدمن)
   */
  static async getSystemStats(req, res) {
    try {
      const stats = await StoreModel.getSystemStats();

      res.json({
        success: true,
        stats: stats
      });

    } catch (error) {
      console.error("خطأ في جلب إحصائيات النظام:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم"
      });
    }
  }
}

module.exports = StoreController;

