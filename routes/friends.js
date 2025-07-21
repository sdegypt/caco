const express = require('express');
const router = express.Router();
const FriendshipController = require('../controllers/FriendshipController_updated');

// مسارات عرض الصفحات
router.get('/', FriendshipController.showFriendsPage);
router.get('/search', FriendshipController.searchFriends);

// مسارات API لإدارة الأصدقاء
router.post('/send-request', FriendshipController.sendFriendRequest);
router.post('/accept-request', FriendshipController.acceptFriendRequest);
router.post('/reject-request', FriendshipController.rejectFriendRequest);
router.post('/cancel-request', FriendshipController.cancelFriendRequest);
router.post('/block', FriendshipController.blockFriend);
router.post('/unblock', FriendshipController.unblockFriend);
router.post('/remove', FriendshipController.removeFriend);
router.post('/remove-friend', FriendshipController.removeFriend);

// مسار معالجة إجراءات الصداقة
router.post('/handle-action', FriendshipController.handleFriendAction);

// مسارات API للاستعلامات
router.get('/status/:userId', FriendshipController.getRelationshipStatus);
router.get('/unread-count', FriendshipController.getUnreadRequestsCount);

// مسارات إضافية للتوافق مع الكود الموجود
router.post('/accept-request/:id', FriendshipController.acceptFriendRequest);
router.post('/reject-request/:id', FriendshipController.rejectFriendRequest);
router.post('/block/:id', FriendshipController.blockFriend);
router.post('/unblock/:id', FriendshipController.unblockFriend);
router.post('/remove/:id', FriendshipController.removeFriend);
router.post('/cancel-request/:id', FriendshipController.cancelFriendRequest);

module.exports = router;

