const express = require("express");
const router = express.Router();
const ProfileControllers = require("../controllers/ProfileControllers");
const multer = require("multer");
const path = require("path");
const verifyToken = require("../middleware/verifyToken");
const { uploadAvatar, uploadGallery } = require('../config/multerConfig');

// استخدام الذاكرة المؤقتة بدلاً من القرص لتجنب مشكلة نظام الملفات للقراءة فقط على Vercel
const designStorage = multer.memoryStorage();
const designUpload = multer({ 
  storage: designStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // حد أقصى 10 ميجابايت
  }
});

// إعداد التخزين للملفات (الصور)
const storage = multer.memoryStorage();

// تكوين multer مع تخزين الملفات
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("الصور فقط مسموح بها (jpeg/jpg/png)!"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // حد أقصى 5 ميجابايت
});

// مسار عرض صفحة الملف الشخصي
router.get("/profile", verifyToken, ProfileControllers.GetProfileControllers);

// مسار عرض صفحة تعديل الملف الشخصي
router.get("/updateProfile", verifyToken, ProfileControllers.GetUpdateProfileControllers);

// مسار تحديث الملف الشخصي
router.post(
  "/updateProfile",
  verifyToken,
  uploadAvatar.single("avatar"),
  ProfileControllers.UpdateProfileControllers
);

// مسار تبديل الإعجاب
router.post("/profile/like", verifyToken, ProfileControllers.toggleLike);

// مسار إدارة طلبات الصداقة
router.post("/profile/friend-action", verifyToken, ProfileControllers.handleFriendAction);

// مسار تحديث الاقتباس
router.post("/profile/update-quote", verifyToken, ProfileControllers.updateQuote);

// مسارات معرض التصميم
router.post("/profile/design/add", verifyToken, uploadGallery.single("image"), ProfileControllers.addDesign);
router.post("/profile/design/delete/:designId", verifyToken, ProfileControllers.deleteDesign);

// مسار للحصول على بيانات التقييم المفصلة
router.get("/profile/ranking-details", verifyToken, ProfileControllers.getRankingDetails);

module.exports = router;

