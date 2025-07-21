const express = require("express");
const router = express.Router();
const FriendshipController = require("../controllers/FriendshipController");

// عرض صفحة الأصدقاء
router.get("/friends", FriendshipController.showFriendsPage);

// البحث عن الأصدقاء
router.get("/friends/search", FriendshipController.searchFriends);

// معالجة إجراءات الصداقة
router.post("/friends/handle-action", FriendshipController.handleFriendAction);

// إرسال طلب صداقة
router.post("/friends/send-request", FriendshipController.sendFriendRequest);

// قبول طلب صداقة
router.post("/friends/accept-request/:id", FriendshipController.acceptFriendRequest);

// رفض طلب صداقة
router.post("/friends/reject-request/:id", FriendshipController.rejectFriendRequest);

// حظر صديق
router.post("/friends/block/:id", FriendshipController.blockFriend);

// إلغاء حظر صديق
router.post("/friends/unblock/:id", FriendshipController.unblockFriend);

// إلغاء طلب صداقة
router.post("/friends/cancel-request/:id", FriendshipController.cancelFriendRequest);

// إزالة صديق
router.post("/friends/remove/:id", FriendshipController.removeFriend);

// عرض ملف صديق
router.get("/friends/profile/:friendId", FriendshipController.viewFriendProfile);

// عرض ملف صديق باستخدام المعرف من الجلسة
router.get("/friends/profile-by-session/:id", FriendshipController.viewFriendProfileBySession);

// تبديل الإعجاب
router.post("/friends/toggle-like", FriendshipController.toggleLike);

module.exports = router;