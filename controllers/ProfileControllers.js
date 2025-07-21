const ProfileModels = require("../models/ProfileModels");
const NotificationModel = require("../models/NotificationModel");
const FriendshipModel = require("../models/FriendshipModel_updated");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const StoreModel = require("../models/StoreModel");

class ProfileControllers {
  static async addDesign(req, res) {
    try {
      if (!req.user || !req.user.id) return res.status(403).json({ success: false, message: "مطلوب تسجيل الدخول." });
      const userId = req.user.id;
      const { title, subtitle } = req.body;
      // Cloudinary: إذا كان الملف مرفوع على كلاوديناري، req.file.path سيكون رابط مباشر
      let image = null;
      if (req.file) {
        if (req.file.path && req.file.path.startsWith('http')) {
          image = req.file.path; // رابط Cloudinary مباشر
        } else if (req.file.filename) {
          image = req.file.filename; // اسم ملف محلي
        }
      }
  
      if (!image || !title) return res.status(400).json({ success: false, message: "الصورة والعنوان مطلوبان." });
  
      const designId = await ProfileModels.addDesign(userId, image, title, subtitle);
      res.json({
        success: true,
        design: {
          id: designId,
          user_id: userId,
          image,
          title,
          subtitle
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "حدث خطأ في الخادم." });
    }
  }

  static async deleteDesign(req, res) {
    try {
      if (!req.user || !req.user.id) return res.status(403).json({ success: false, message: "مطلوب تسجيل الدخول." });
      const userId = req.user.id;
      const designId = req.params.designId;
  
      const deleted = await ProfileModels.deleteDesign(designId, userId);
      if (deleted) {
        res.json({
          success: true,
          designId: designId
        });
      } else {
        res.status(404).json({ success: false, message: "العمل غير موجود أو لا تملك صلاحية حذفه." });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "حدث خطأ في الخادم." });
    }
  }

  static async GetProfileControllers(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ success: false, message: "يرجى تسجيل الدخول" });

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;
      const friendId = req.query.userId || userId;

      const user = await ProfileModels.GetProfileModels(friendId);
      if (!user) return res.status(404).json({ success: false, message: "المستخدم غير موجود" });

      const currentUser = await ProfileModels.GetProfileModels(userId);
      const currentUserAvatar = currentUser && currentUser.avatar ? `/uploads/avatars/${currentUser.avatar}` : '/uploads/images/pngwing.com.png';

      // استخدام FriendshipModel للحصول على حالة الصداقة
      const friendStatusResult = await FriendshipModel.getRelationshipStatus(userId, friendId);
      let friendStatus = friendStatusResult.relationship_status;
      
      // تعيين القيم لتتوافق مع جافاسكريبت
      switch(friendStatus) {
        case 'friend':
          friendStatus = 'accepted';
          break;
        case 'request_sent':
          friendStatus = 'pending_sent';
          break;
        case 'request_received':
          friendStatus = 'pending_received';
          break;
        case 'not_friend':
          friendStatus = 'no_friend';
          break;
        default:
          friendStatus = 'no_friend';
      }
      
      console.log('حالة الصداقة:', { userId, friendId, friendStatusResult, friendStatus });
      const unreadCount = await NotificationModel.getUnreadCount(userId);
      const hasLiked = await ProfileModels.hasUserLiked(userId, friendId);
      const gallery = await ProfileModels.getGallery(friendId);

      user.avatar = user.avatar && user.avatar.startsWith('http') ? user.avatar : '/uploads/images/pngwing.com.png';
      user.liked = hasLiked;

      console.log('إرسال البيانات للصفحة:', { 
        userId, 
        friendId, 
        relationshipStatus: friendStatus,
        hasLiked 
      });

      let stores = [];
      if (userId == friendId) {
        stores = await StoreModel.getUserStores(userId);
      }

      res.render("profile", { 
        user, 
        relationshipStatus: friendStatus, 
        userId, 
        currentUserAvatar, 
        unreadCount,
        gallery,
        stores
      });
    } catch (error) {
      logger.error("خطأ في GetProfileControllers:", error);
      res.status(500).json({ 
        success: false, 
        message: "حدث خطأ أثناء عرض الملف الشخصي",
        error: error.message 
      });
    }
  }

  static async GetUpdateProfileControllers(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/login");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const user = await ProfileModels.GetProfileModels(userId);
      if (!user) return res.status(404).send("User not found");

      const currentUserAvatar = user && user.avatar ? `/uploads/avatars/${user.avatar}` : '/uploads/images/pngwing.com.png';
      const unreadCount = await NotificationModel.getUnreadCount(userId);

      res.render("updateProfile", { 
        user, 
        currentUserAvatar, 
        unreadCount 
      });
    } catch (error) {
      res.status(500).send("حدث خطأ أثناء عرض صفحة تعديل الملف الشخصي.");
    }
  }

  static async UpdateProfileControllers(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: "حدث خطأ في الخادم أو تم تسجيل خروجك. أعد تحميل الصفحة وسجل الدخول مجدداً." 
        });
      }

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const { name, age, gender, country, language, occupation, phone, portfolio } = req.body;

      const currentUser = await ProfileModels.GetProfileModels(userId);
      if (!currentUser) {
        return res.status(404).json({ 
          success: false, 
          message: "المستخدم غير موجود" 
        });
      }

      let avatar = currentUser.avatar;
      if (req.file) {
        avatar = req.file.path;
      }

      const updatedData = {
        name,
        age,
        gender,
        country,
        language,
        occupation,
        phone,
        portfolio,
        avatar,
      };

      const result = await ProfileModels.UpdateProfileModels(userId, updatedData);

      if (result && result.affectedRows > 0) {
        res.json({ 
          success: true, 
          message: "تم تحديث الملف الشخصي بنجاح",
          user: updatedData
        });
      } else {
        res.status(400).json({ 
          success: false, 
          message: "فشل في تحديث الملف الشخصي" 
        });
      }
    } catch (error) {
      console.error("خطأ في UpdateProfileControllers:", error);
      res.status(500).json({ 
        success: false, 
        message: "حدث خطأ في الخادم أو تم تسجيل خروجك. أعد تحميل الصفحة وسجل الدخول مجدداً." 
      });
    }
  }

  static async toggleLike(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ success: false, message: "يرجى تسجيل الدخول" });

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;
      const friendId = req.body.friendId;

      if (!friendId) {
        return res.status(400).json({ success: false, message: "معرف المستخدم مطلوب" });
      }

      if (userId === parseInt(friendId)) {
        return res.status(400).json({ success: false, message: "لا يمكنك إعطاء إعجاب لنفسك" });
      }

      const result = await ProfileModels.toggleLike(userId, friendId);

      if (result.success) {
        return res.json({
          success: true,
          likes: result.likes,
          ranking: result.ranking,
          liked: result.liked,
        });
      } else {
        res.status(400).json({ success: false, message: result.message || "حدث خطأ أثناء تحديث الإعجاب." });
      }
    } catch (error) {
      logger.error("Error in toggleLike:", error);
      res.status(500).json({ success: false, message: "حدث خطأ في الخادم." });
    }
  }

  static async handleFriendAction(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ success: false, message: "يرجى تسجيل الدخول" });

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;
      const { friendId, action } = req.body;

      if (!friendId || !action) {
        return res.status(400).json({ 
          success: false, 
          message: "معرف المستخدم والإجراء مطلوبان" 
        });
      }

      if (userId === parseInt(friendId)) {
        return res.status(400).json({ 
          success: false, 
          message: "لا يمكنك تنفيذ هذا الإجراء على نفسك" 
        });
      }

      let result;
      let newStatus;
      let message;

      switch (action) {
        case "send_request":
          // التحقق من الحالة الحالية
          const currentStatusResult = await FriendshipModel.getRelationshipStatus(userId, friendId);
          const currentStatus = currentStatusResult.relationship_status;
          if (currentStatus === "request_sent") {
            return res.json({ 
              success: false, 
              message: "طلب الصداقة قيد الانتظار بالفعل",
              friendStatus: "pending_sent" 
            });
          }
          
          // التحقق من عدد الأصدقاء
          const friendCount = await FriendshipModel.getFriendsCount(userId);
          if (friendCount >= 20) {
            return res.status(400).json({ 
              success: false, 
              message: "لا يمكنك إضافة المزيد من الأصدقاء. لقد وصلت للحد الأقصى (20)" 
            });
          }

          await FriendshipModel.sendFriendRequest(userId, friendId);
          
          // إرسال إشعار
          const senderName = (await FriendshipModel.getUserProfile(userId)).name || "مستخدم";
          await NotificationModel.createNotification(
            friendId,
            userId,
            "friend_request",
            `${senderName} أرسل لك طلب صداقة`
          );
          
          newStatus = "pending_sent";
          message = "تم إرسال طلب الصداقة بنجاح";
          break;

        case "cancel_request":
          await FriendshipModel.cancelFriendRequest(userId, friendId);
          newStatus = "no_friend";
          message = "تم إلغاء طلب الصداقة بنجاح";
          break;

        case "accept_request":
          // البحث عن طلب الصداقة
          const friendRequests = await FriendshipModel.getFriendRequests(userId);
          const request = friendRequests.find(req => req.sender_id === parseInt(friendId));
          
          if (!request) {
            return res.status(404).json({ 
              success: false, 
              message: "طلب الصداقة غير موجود" 
            });
          }

          await FriendshipModel.acceptFriendRequest(request.id, userId);
          
          // إرسال إشعار
          const receiverName = (await FriendshipModel.getUserProfile(userId)).name || "مستخدم";
          await NotificationModel.createNotification(
            friendId,
            userId,
            "friend_accepted",
            `${receiverName} قبل طلب صداقتك`
          );
          
          newStatus = "accepted";
          message = "تم قبول طلب الصداقة بنجاح";
          break;

        case "remove_friend":
          await FriendshipModel.removeFriend(userId, friendId);
          newStatus = "no_friend";
          message = "تم إزالة الصديق بنجاح";
          break;

        default:
          const defaultStatusResult = await FriendshipModel.getRelationshipStatus(userId, friendId);
          let defaultStatus = defaultStatusResult.relationship_status;
          
          // تعيين القيم لتتوافق مع جافاسكريبت
          switch(defaultStatus) {
            case 'friend':
              defaultStatus = 'accepted';
              break;
            case 'request_sent':
              defaultStatus = 'pending_sent';
              break;
            case 'request_received':
              defaultStatus = 'pending_received';
              break;
            case 'not_friend':
              defaultStatus = 'no_friend';
              break;
            default:
              defaultStatus = 'no_friend';
          }
          
          return res.status(400).json({ 
            success: false, 
            message: "إجراء غير صالح",
            friendStatus: defaultStatus
          });
      }

      return res.json({ 
        success: true, 
        message: message,
        friendStatus: newStatus
      });
    } catch (error) {
      logger.error("Error in handleFriendAction:", error);
      res.status(500).json({ 
        success: false, 
        message: "حدث خطأ في الخادم",
        error: error.message 
      });
    }
  }

  static async updateQuote(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ success: false, message: "يرجى تسجيل الدخول" });

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;
      const { quote } = req.body;

      const result = await ProfileModels.updateUserQuote(userId, quote);

      if (result) res.json({ success: true });
      else res.json({ success: false });
    } catch (error) {
      res.status(500).json({ success: false });
    }
  }

  static async showProfile(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ success: false, message: "يرجى تسجيل الدخول" });

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const user = await ProfileModels.GetProfileModels(userId);
      if (!user) return res.status(404).json({ success: false, message: "المستخدم غير موجود" });

      const unreadCount = await NotificationModel.getUnreadCount(userId);

      // منطق موحد: إذا كان user.avatar يبدأ بـ http مرر كما هو، وإلا صورة افتراضية
      user.avatar = user.avatar && user.avatar.startsWith('http') ? user.avatar : '/uploads/images/pngwing.com.png';
      user.liked = hasLiked;

      res.render("profile", { 
        user, 
        userId, 
        unreadCount 
      });
    } catch (error) {
      logger.error("خطأ في showProfile:", error);
      res.status(500).json({ 
        success: false, 
        message: "حدث خطأ في الخادم",
        error: error.message 
      });
    }
  }

  static async getRankingDetails(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ success: false, message: "يرجى تسجيل الدخول" });

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;
      const targetUserId = req.query.userId || userId;

      const rankingData = await ProfileModels.calculateUserRanking(targetUserId);
      const user = await ProfileModels.GetProfileModels(targetUserId);
      
      if (!user) {
        return res.status(404).json({ success: false, message: "المستخدم غير موجود" });
      }

      // حساب التقدم نحو المستوى التالي بشكل آمن
      const currentLevelPoints = user.ranking * 10;
      const nextLevelPoints = (user.ranking + 1) * 10;
      let progress = 0;
      if (rankingData.totalPoints <= currentLevelPoints) {
        progress = 0;
      } else if (rankingData.totalPoints >= nextLevelPoints) {
        progress = 1;
      } else {
        progress = (rankingData.totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints);
      }
      const progressPercentage = progress * 100;

      res.json({
        success: true,
        rankingData: {
          currentLevel: user.ranking,
          totalPoints: rankingData.totalPoints,
          currentLevelPoints: currentLevelPoints,
          nextLevelPoints: nextLevelPoints,
          progressPercentage: progressPercentage,
          pointsToNextLevel: Math.max(nextLevelPoints - rankingData.totalPoints, 0)
        }
      });
    } catch (error) {
      logger.error("Error in getRankingDetails:", error);
      res.status(500).json({ 
        success: false, 
        message: "حدث خطأ في الخادم",
        error: error.message 
      });
    }
  }
}

module.exports = ProfileControllers;

