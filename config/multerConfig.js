const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// تكوين Cloudinary
cloudinary.config({
  cloud_name: 'dyftlowtv',
  api_key: '611352352948995',
  api_secret: '9rEZK2K5yAafu9hqq4LlmGhMuF8'
});

// تكوين التخزين للصور الشخصية
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 300, height: 300, crop: 'fill' }]
  }
});

// تكوين التخزين لصور المنتدى
const forumStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'forum',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }]
  }
});

// تكوين التخزين لصور المعرض
const galleryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }]
  }
});

// تكوين التخزين لصور المتجر
const storeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'store',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 600, height: 400, crop: 'limit' }]
  }
});

// تكوين التخزين لصور المشاريع
const projectStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }]
  }
});

// تكوين التخزين لصور الوظائف
const jobStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'jobs',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 600, height: 400, crop: 'limit' }]
  }
});

// تكوين التخزين لصور المحادثات
const chatStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'chat',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 400, height: 300, crop: 'limit' }]
  }
});

// إنشاء مثيلات multer
const uploadAvatar = multer({ storage: avatarStorage });
const uploadForum = multer({ storage: forumStorage });
const uploadGallery = multer({ storage: galleryStorage });
const uploadStore = multer({ storage: storeStorage });
const uploadProject = multer({ storage: projectStorage });
const uploadJob = multer({ storage: jobStorage });
const uploadChat = multer({ storage: chatStorage });

module.exports = {
  cloudinary,
  uploadAvatar,
  uploadForum,
  uploadGallery,
  uploadStore,
  uploadProject,
  uploadJob,
  uploadChat
};
