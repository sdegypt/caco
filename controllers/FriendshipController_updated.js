const FriendshipModel = require("../models/FriendshipModel_updated");
const ProfileModels = require("../models/ProfileModels");
const NotificationModel = require("../models/NotificationModel");
const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

class FriendshipController {
  // عرض صفحة الأصدقاء
  static async showFriendsPage(req, res) {
    try {
      const token = req.cookies.token;
      
      if (!token) {
        return res.redirect("/login");
      }

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const friends = await FriendshipModel.getAcceptedFriends(userId, 0, 10);
      const friendRequests = await FriendshipModel.getFriendRequests(userId);
      const blockedFriends = await FriendshipModel.getBlockedFriends(userId);
      const allUsers = await FriendshipModel.getAllUsersExceptCurrent(userId, 0, 10);
      const unreadCount = await NotificationModel.getUnreadCount(userId);
      

      const enrichedFriends = friends.map(friend => ({
        ...friend,
        avatar: friend.avatar && friend.avatar.startsWith('http') ? friend.avatar : '/uploads/images/pngwing.com.png',
        online: friend.last_active ? (Date.now() - new Date(friend.last_active).getTime() < 5 * 60 * 1000) : false,
        isActive: friend.is_active
      }));

      const enrichedFriendRequests = friendRequests.map(request => ({
        ...request,
        sender_avatar: request.sender_avatar && request.sender_avatar.startsWith('http') ? request.sender_avatar : '/uploads/images/pngwing.com.png'
      }));

      const enrichedBlockedFriends = blockedFriends.map(blocked => ({
        ...blocked,
        avatar: blocked.avatar && blocked.avatar.startsWith('http') ? blocked.avatar : '/uploads/images/pngwing.com.png'
      }));

      const enrichedUsers = allUsers.map(user => ({
        ...user,
        avatar: user.avatar && user.avatar.startsWith('http') ? user.avatar : '/uploads/images/pngwing.com.png',
        isActive: user.is_active,
        country: user.country || 'غير محدد',
        age: user.age || 'غير محدد',
        language: user.language || 'غير محدد'
      }));

      await FriendshipModel.updateLastActive(userId);

      res.render("friends", {
        friends: enrichedFriends,
        friendRequests: enrichedFriendRequests,
        blockedFriends: enrichedBlockedFriends,
        searchResults: null,
        users: enrichedUsers,
        unreadCount,
        errorMessage: null,
        successMessage: null
      });
    } catch (error) {
      logger.error("Error in showFriendsPage:", error);
      res.status(500).render("friends", {
        friends: [],
        friendRequests: [],
        blockedFriends: [],
        searchResults: null,
        users: [],
        unreadCount: 0,
        errorMessage: "حدث خطأ أثناء تحميل بيانات الأصدقاء",
        successMessage: null
      });
    }
  }

  // البحث عن الأصدقاء
  static async searchFriends(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/login");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;
      const searchQuery = req.query.q?.trim();

      if (!searchQuery) {
        return res.redirect("/friends");
      }

      const searchResults = await FriendshipModel.searchUsers(userId, searchQuery);
      const friends = await FriendshipModel.getAcceptedFriends(userId, 0, 10);
      const friendRequests = await FriendshipModel.getFriendRequests(userId);
      const blockedFriends = await FriendshipModel.getBlockedFriends(userId);
      const unreadCount = await NotificationModel.getUnreadCount(userId);

      const enrichedFriends = friends.map(friend => ({
        ...friend,
        avatar: friend.avatar && friend.avatar.startsWith('http') ? friend.avatar : '/uploads/images/pngwing.com.png',
        online: friend.last_active ? (Date.now() - new Date(friend.last_active).getTime() < 5 * 60 * 1000) : false,
        isActive: friend.is_active
      }));

      const enrichedFriendRequests = friendRequests.map(request => ({
        ...request,
        sender_avatar: request.sender_avatar && request.sender_avatar.startsWith('http') ? request.sender_avatar : '/uploads/images/pngwing.com.png'
      }));

      const enrichedBlockedFriends = blockedFriends.map(blocked => ({
        ...blocked,
        avatar: blocked.avatar && blocked.avatar.startsWith('http') ? blocked.avatar : '/uploads/images/pngwing.com.png'
      }));

      const enrichedSearchResults = searchResults.map(result => ({
        ...result,
        avatar: result.avatar && result.avatar.startsWith('http') ? result.avatar : '/uploads/images/pngwing.com.png',
        isActive: result.is_active,
        country: result.country || 'غير محدد',
        age: result.age || 'غير محدد',
        language: result.language || 'غير محدد'
      }));

      await FriendshipModel.updateLastActive(userId);

      res.render("friends", {
        friends: enrichedFriends,
        friendRequests: enrichedFriendRequests,
        blockedFriends: enrichedBlockedFriends,
        searchResults: enrichedSearchResults,
        users: [],
        unreadCount,
        errorMessage: searchResults.length === 0 ? "لم يتم العثور على نتائج مطابقة" : null,
        successMessage: null
      });
    } catch (error) {
      logger.error("Error in searchFriends:", error);
      res.status(500).render("friends", {
        friends: [],
        friendRequests: [],
        blockedFriends: [],
        searchResults: [],
        users: [],
        unreadCount: 0,
        errorMessage: "حدث خطأ أثناء البحث عن الأصدقاء",
        successMessage: null
      });
    }
  }

  // إرسال طلب صداقة (API)
  static async sendFriendRequest(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ success: false, message: "يرجى تسجيل الدخول أولاً" });
      }

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;
      const friendId = parseInt(req.body.friendId);

      if (!friendId || isNaN(friendId)) {
        return res.status(400).json({ success: false, message: "معرف المستخدم غير صحيح" });
      }

      if (userId === friendId) {
        return res.status(400).json({ success: false, message: "لا يمكنك إرسال طلب صداقة لنفسك" });
      }

      // التحقق من حالة الصداقة الحالية
      const currentStatus = await FriendshipModel.getRelationshipStatus(userId, friendId);
      
      if (currentStatus.relationship_status === 'friend') {
        return res.status(400).json({ success: false, message: "أنتما صديقان بالفعل" });
      }
      if (currentStatus.relationship_status === 'request_sent') {
        return res.status(400).json({ success: false, message: "طلب الصداقة قيد الانتظار بالفعل" });
      }

      // التحقق من عدد الأصدقاء
      const friendCount = await FriendshipModel.getFriendsCount(userId);
      if (friendCount >= 20) {
        return res.status(400).json({ 
          success: false, 
          message: "لا يمكنك إضافة المزيد من الأصدقاء. لقد وصلت للحد الأقصى (20)" 
        });
      }

      // التحقق من وجود المستخدم المستهدف
      const friendProfile = await FriendshipModel.getUserProfile(friendId);
      if (!friendProfile) {
        return res.status(404).json({ success: false, message: "المستخدم المطلوب غير موجود" });
      }

      if (!friendProfile.is_active) {
        return res.status(400).json({ success: false, message: "لا يمكنك إرسال طلب صداقة لمستخدم غير نشط" });
      }

      // إرسال طلب الصداقة
      await FriendshipModel.sendFriendRequest(userId, friendId);
      
      // إرسال إشعار
      const senderName = (await FriendshipModel.getUserProfile(userId)).name || "مستخدم";
      await NotificationModel.createNotification(
        friendId,
        userId,
        "friend_request",
        `${senderName} أرسل لك طلب صداقة`
      );

      return res.status(200).json({ 
        success: true, 
        message: "تم إرسال طلب الصداقة بنجاح" 
      });
    } catch (error) {
      logger.error("Error in sendFriendRequest:", error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || "حدث خطأ أثناء إرسال طلب الصداقة" 
      });
    }
  }

  // قبول طلب صداقة (API)
  static async acceptFriendRequest(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ success: false, message: "يرجى تسجيل الدخول أولاً" });
      }

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;
      const requestId = parseInt(req.body.requestId || req.params.id);

      if (!requestId || isNaN(requestId)) {
        return res.status(400).json({ success: false, message: "معرف الطلب غير صحيح" });
      }

      // التحقق من وجود الطلب
      const request = await FriendshipModel.getFriendRequestById(requestId);
      if (!request) {
        return res.status(404).json({ success: false, message: "طلب الصداقة غير موجود" });
      }

      // التحقق من أن المستخدم هو المستلم
      if (request.receiver_id !== userId) {
        return res.status(403).json({ success: false, message: "ليس لديك صلاحية لقبول هذا الطلب" });
      }

      const result = await FriendshipModel.acceptFriendRequest(requestId, userId);

      // إرسال إشعار للمرسل
      const receiverName = (await FriendshipModel.getUserProfile(userId)).name || "مستخدم";
      await NotificationModel.createNotification(
        result.senderId,
        userId,
        "friend_accepted",
        `${receiverName} قبل طلب صداقتك`
      );

      return res.status(200).json({ 
        success: true, 
        message: "تم قبول طلب الصداقة بنجاح" 
      });
    } catch (error) {
      logger.error("Error in acceptFriendRequest:", error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || "حدث خطأ أثناء قبول طلب الصداقة" 
      });
    }
  }

  // رفض طلب صداقة (API)
  static async rejectFriendRequest(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ success: false, message: "يرجى تسجيل الدخول أولاً" });
      }

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;
      const requestId = parseInt(req.body.requestId || req.params.id);

      if (!requestId || isNaN(requestId)) {
        return res.status(400).json({ success: false, message: "معرف الطلب غير صحيح" });
      }

      await FriendshipModel.rejectFriendRequest(requestId, userId);

      return res.status(200).json({ 
        success: true, 
        message: "تم رفض طلب الصداقة" 
      });
    } catch (error) {
      logger.error("Error in rejectFriendRequest:", error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || "حدث خطأ أثناء رفض طلب الصداقة" 
      });
    }
  }

  // إلغاء طلب صداقة (API)
  static async cancelFriendRequest(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ success: false, message: "يرجى تسجيل الدخول أولاً" });
      }

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;
      const friendId = parseInt(req.body.friendId || req.params.id);

      if (!friendId || isNaN(friendId)) {
        return res.status(400).json({ success: false, message: "معرف المستخدم غير صحيح" });
      }

      await FriendshipModel.cancelFriendRequest(userId, friendId);

      return res.status(200).json({ 
        success: true, 
        message: "تم إلغاء طلب الصداقة" 
      });
    } catch (error) {
      logger.error("Error in cancelFriendRequest:", error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || "حدث خطأ أثناء إلغاء طلب الصداقة" 
      });
    }
  }

  // حظر مستخدم (API)
  static async blockFriend(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ success: false, message: "يرجى تسجيل الدخول أولاً" });
      }

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;
      const friendId = parseInt(req.body.friendId || req.params.id);

      if (!friendId || isNaN(friendId)) {
        return res.status(400).json({ success: false, message: "معرف المستخدم غير صحيح" });
      }

      if (userId === friendId) {
        return res.status(400).json({ success: false, message: "لا يمكنك حظر نفسك" });
      }

      // التحقق من وجود المستخدم
      const friendProfile = await FriendshipModel.getUserProfile(friendId);
      if (!friendProfile) {
        return res.status(404).json({ success: false, message: "المستخدم المطلوب غير موجود" });
      }

      await FriendshipModel.blockFriend(userId, friendId);

      return res.status(200).json({ 
        success: true, 
        message: "تم حظر المستخدم بنجاح" 
      });
    } catch (error) {
      logger.error("Error in blockFriend:", error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || "حدث خطأ أثناء حظر المستخدم" 
      });
    }
  }

  // إلغاء حظر مستخدم (API)
  static async unblockFriend(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ success: false, message: "يرجى تسجيل الدخول أولاً" });
      }

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;
      const friendId = parseInt(req.body.friendId || req.params.id);

      if (!friendId || isNaN(friendId)) {
        return res.status(400).json({ success: false, message: "معرف المستخدم غير صحيح" });
      }

      await FriendshipModel.unblockFriend(userId, friendId);

      return res.status(200).json({ 
        success: true, 
        message: "تم إلغاء حظر المستخدم بنجاح" 
      });
    } catch (error) {
      logger.error("Error in unblockFriend:", error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || "حدث خطأ أثناء إلغاء حظر المستخدم" 
      });
    }
  }

  // إزالة صديق (API)
  static async removeFriend(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ success: false, message: "يرجى تسجيل الدخول أولاً" });
      }

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;
      const friendId = parseInt(req.body.friendId || req.params.id);

      if (!friendId || isNaN(friendId)) {
        return res.status(400).json({ success: false, message: "معرف المستخدم غير صحيح" });
      }

      await FriendshipModel.removeFriend(userId, friendId);

      return res.status(200).json({ 
        success: true, 
        message: "تم إزالة الصديق بنجاح" 
      });
    } catch (error) {
      logger.error("Error in removeFriend:", error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || "حدث خطأ أثناء إزالة الصديق" 
      });
    }
  }

  // جلب حالة العلاقة (API)
  static async getRelationshipStatus(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ success: false, message: "يرجى تسجيل الدخول أولاً" });
      }

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;
      const targetUserId = parseInt(req.params.userId);

      if (!targetUserId || isNaN(targetUserId)) {
        return res.status(400).json({ success: false, message: "معرف المستخدم غير صحيح" });
      }

      const status = await FriendshipModel.getRelationshipStatus(userId, targetUserId);

      return res.status(200).json({ 
        success: true, 
        status: status.relationship_status,
        requestId: status.request_id
      });
    } catch (error) {
      logger.error("Error in getRelationshipStatus:", error);
      return res.status(500).json({ 
        success: false, 
        message: "حدث خطأ أثناء جلب حالة العلاقة" 
      });
    }
  }

  // الحصول على عدد طلبات الصداقة غير المقروءة (API)
  static async getUnreadRequestsCount(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ success: false, message: "يرجى تسجيل الدخول أولاً" });
      }

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const unreadCount = await FriendshipModel.getUnreadFriendRequestsCount(userId);
      
      res.json({ success: true, unreadCount });
    } catch (error) {
      logger.error("Error in getUnreadRequestsCount:", error);
      res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
    }
  }

  // الحصول على قائمة طلبات الصداقة (API)
  static async getFriendRequests(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ success: false, message: "يرجى تسجيل الدخول أولاً" });
      }

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const friendRequests = await FriendshipModel.getFriendRequests(userId);
      
      res.json({ success: true, requests: friendRequests });
    } catch (error) {
      logger.error("Error in getFriendRequests:", error);
      res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
    }
  }

  // معالجة إجراءات الصداقة المختلفة
  static async handleFriendAction(req, res) {
    try {
      const { friendId, action } = req.body;
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).json({ success: false, message: "يرجى تسجيل الدخول" });
      }

      if (!friendId) {
        return res.status(400).json({ success: false, message: "معرف الصديق مطلوب" });
      }

      let result;
      let newStatus;
      let message;

      switch (action) {
        case "send_request":
          try {
            await FriendshipModel.sendFriendRequest(userId, friendId);
            newStatus = "pending_sent";
            message = "تم إرسال طلب الصداقة بنجاح";
          } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
          }
          break;

        case "cancel_request":
          try {
            await FriendshipModel.cancelFriendRequest(userId, friendId);
            newStatus = "no_friend";
            message = "تم إلغاء طلب الصداقة بنجاح";
          } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
          }
          break;

        case "accept_request":
          try {
            const request = await FriendshipModel.getFriendRequestBySender(friendId, userId);
            if (!request) {
              return res.status(400).json({ success: false, message: "طلب الصداقة غير موجود" });
            }
            await FriendshipModel.acceptFriendRequest(request.id, userId);
            newStatus = "accepted";
            message = "تم قبول طلب الصداقة بنجاح";
          } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
          }
          break;

        case "remove_friend":
          try {
            await FriendshipModel.removeFriend(userId, friendId);
            newStatus = "no_friend";
            message = "تم إزالة الصديق بنجاح";
          } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
          }
          break;

        default:
          return res.status(400).json({ success: false, message: "إجراء غير صالح" });
      }

      res.json({ success: true, message, newStatus });
    } catch (error) {
      logger.error("Error in handleFriendAction:", error);
      res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
    }
  }
}

module.exports = FriendshipController;

