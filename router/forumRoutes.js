const express = require("express");
const router = express.Router();
const ForumController = require("../controllers/ForumController");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const verifyToken = require("../middleware/verifyToken");
const { uploadForum } = require('../config/multerConfig');
const ejs = require('ejs');

// استخدام الذاكرة المؤقتة بدلاً من القرص لتجنب مشكلة نظام الملفات للقراءة فقط على Vercel
const postStorage = multer.memoryStorage();
const postUpload = multer({ 
  storage: postStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // حد أقصى 10 ميجابايت
  }
});

const adStorage = multer.memoryStorage();
const adUpload = multer({ 
  storage: adStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // حد أقصى 5 ميجابايت
  }
});

router.get("/", ForumController.getAllPosts);
router.post("/post", verifyToken, uploadForum.array("postImages", 4), ForumController.addPost);
router.get("/post/:postId/edit", verifyToken, ForumController.editPostForm);
router.post("/post/:postId/edit", verifyToken, uploadForum.array("postImages", 4), ForumController.updatePost);
router.post("/post/:id/delete", verifyToken, ForumController.deletePost);
router.post("/toggle-like/:id", verifyToken, ForumController.toggleLike);
router.post("/post/:id/share", verifyToken, ForumController.sharePost);
router.post("/post/:id/hide", verifyToken, ForumController.hidePost);
router.post("/comments/:postId/add", verifyToken, ForumController.addComment);
router.get("/comments/:postId", ForumController.getComments);
router.post("/comments/:commentId/like", verifyToken, ForumController.toggleLikeComment);
router.get("/post/:postId", ForumController.getPostDetails);
router.post("/ad", verifyToken, uploadForum.single("image"), ForumController.addAd);
router.get("/ad/:id", verifyToken, ForumController.getAd);
router.put("/ad/:id", verifyToken, uploadForum.single("image"), ForumController.updateAd);
router.delete("/ad/:id", verifyToken, ForumController.deleteAd);
router.get("/my-posts", verifyToken, ForumController.getUserPosts);

// إضافة راوت جلب المزيد من المنشورات (infinite scroll)
router.get('/more-posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    // جلب المنشورات من الموديل مع limit/offset
    const posts = await ForumController.getPaginatedPosts(limit, offset, req);
    if (!posts || posts.length === 0) {
      return res.json({ success: true, posts: [] });
    }
    // تحويل كل منشور إلى HTML جزئي (نفس كود منشور واحد في forum.ejs)
    const postsHtml = await Promise.all(posts.map(async (post) => {
      return await ejs.renderFile(
        __dirname + '/../views/partials/_forumPost.ejs',
        { post, currentUserId: req.user ? req.user.id : null, getCloudinaryImageUrl: (img, fallback) => img && img.startsWith('http') ? img : (fallback || '/uploads/images/pngwing.com.png') }
      );
    }));
    res.json({ success: true, posts: postsHtml });
  } catch (err) {
    res.json({ success: false, message: 'حدث خطأ في جلب المنشورات.' });
  }
});

module.exports = router;

