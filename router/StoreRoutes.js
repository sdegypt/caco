const express = require("express");
const router = express.Router();
const StoreController = require("../controllers/StoreController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const verifyToken = require("../middleware/verifyToken");
const { uploadStore } = require('../config/multerConfig');

// استخدام الذاكرة المؤقتة بدلاً من القرص لتجنب مشكلة نظام الملفات للقراءة فقط على Vercel
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // قبول الصور فقط
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('يُسمح برفع الصور فقط'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Middleware للتحقق من تسجيل الدخول
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "يجب تسجيل الدخول أولاً"
    });
  }
  next();
};

// Middleware للتحقق من صلاحيات الأدمن
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "غير مصرح لك بالوصول"
    });
  }
  next();
};

// ===== مسارات عرض الصفحات =====

// صفحة جميع المتاجر
router.get("/", StoreController.listStores);

// صفحة متجر محدد
router.get("/:storeId", StoreController.getStorePage);

// لوحة تحكم المتجر (للمالك)
router.get("/:storeId/dashboard", verifyToken, requireAuth, StoreController.getStoreDashboard);

// ===== مسارات طلبات إنشاء المتاجر =====

// إنشاء طلب متجر جديد
router.post("/request", verifyToken, requireAuth, StoreController.requestStore);

// الحصول على طلبات المتاجر (للأدمن)
router.get("/admin/requests", verifyToken, requireAuth, requireAdmin, StoreController.getStoreRequests);

// معالجة طلب متجر (موافقة/رفض) - للأدمن
router.post("/admin/requests/:requestId/process", verifyToken, requireAuth, requireAdmin, StoreController.processStoreRequest);

// ===== مسارات إدارة المتاجر =====

// تحديث معلومات المتجر
router.put("/:storeId", verifyToken, requireAuth, uploadStore.single("coverImage"), StoreController.updateStore);

// الحصول على متاجر المستخدم
router.get("/user/my-stores", verifyToken, requireAuth, StoreController.getUserStores);

// ===== مسارات إدارة المنتجات =====

// إضافة منتج جديد
router.post("/:storeId/products", verifyToken, requireAuth, uploadStore.array("images", 5), StoreController.addProduct);

// تحديث منتج
router.put("/products/:productId", verifyToken, requireAuth, StoreController.updateProduct);

// حذف منتج
router.delete("/products/:productId", verifyToken, requireAuth, StoreController.deleteProduct);

// تغيير حالة المنتج (تفعيل/إلغاء تفعيل)
router.patch("/products/:productId/toggle-status", verifyToken, requireAuth, StoreController.toggleProductStatus);

// ===== مسارات إدارة صور المنتجات =====

// إضافة صورة للمنتج
router.post("/products/:productId/images", verifyToken, requireAuth, uploadStore.single("image"), StoreController.addProductImage);

// حذف صورة المنتج
router.delete("/products/images/:imageId", verifyToken, requireAuth, StoreController.deleteProductImage);

// تعيين صورة كصورة رئيسية
router.patch("/products/:productId/images/:imageId/set-primary", verifyToken, requireAuth, StoreController.setPrimaryImage);

// ===== مسارات الإحصائيات =====

// إحصائيات النظام (للأدمن)
router.get("/admin/stats", verifyToken, requireAuth, requireAdmin, StoreController.getSystemStats);

// ===== معالجة الأخطاء =====

// معالجة أخطاء multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: "حجم الملف كبير جداً (الحد الأقصى 5MB)"
      });
    }
  }
  
  if (error.message === 'يُسمح برفع الصور فقط') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
});

module.exports = router;

