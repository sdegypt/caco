const ChatModel = require("../models/chatModel");
const NotificationModel = require("../models/NotificationModel");
const jwt = require("jsonwebtoken");

class ChatController {
  static async getChatPage(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).send("يرجى تسجيل الدخول أولاً");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;
      const friendId = req.params.friendId;

      // Fetch initial messages - the client will poll for new ones
      const messages = await ChatModel.getMessages(userId, friendId, 0); // Fetch all initially
      const user = await ChatModel.getUserById(userId);
      const friend = await ChatModel.getUserById(friendId);

      if (!user || !friend) {
        return res.render("chat", {
          messages: [],
          friendId,
          userId,
          currentUserName: user ? user.name : '',
          currentUserAvatar: user && user.avatar && user.avatar.startsWith('http') ? user.avatar : '/uploads/images/pngwing.com.png',
          friendAvatar: friend && friend.avatar && friend.avatar.startsWith('http') ? friend.avatar : '/uploads/images/pngwing.com.png',
          friendName: friend ? friend.name : '',
          friendLastActive: friend ? friend.last_active : '',
          unreadCount: 0,
          unreadMessagesCount: 0,
          errorMessage: "المستخدم أو الصديق غير موجود أو تم حذفه."
        });
      }

      const currentUserAvatar = user.avatar && user.avatar.startsWith('http') ? user.avatar : '/uploads/images/pngwing.com.png';
      const friendAvatar = friend.avatar && friend.avatar.startsWith('http') ? friend.avatar : '/uploads/images/pngwing.com.png';

      const enrichedMessages = messages.map((message) => ({
        ...message,
        sender_avatar: message.sender_id.toString() === userId.toString()
          ? currentUserAvatar
          : (message.sender_avatar && message.sender_avatar.startsWith('http') ? message.sender_avatar : '/uploads/images/pngwing.com.png'),
      }));

      await ChatModel.updateLastActive(userId);

      const unreadCount = await NotificationModel.getUnreadCount(userId);
      const unreadMessagesCount = await ChatModel.getUnreadCount(userId); // Assuming this counts unread messages from all chats

      res.render("chat", {
        messages: enrichedMessages,
        friendId,
        userId,
        currentUserName: user.name, // Added currentUserName
        currentUserAvatar,
        friendAvatar,
        friendName: friend.name,
        friendLastActive: friend.last_active,
        unreadCount,
        unreadMessagesCount,
      });
    } catch (error) {
      logger.error("Error in getChatPage:", error);
      res.status(500).send("خطأ في تحميل صفحة الدردشة");
    }
  }

  static async getMessages(req, res) {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "يرجى تسجيل الدخول أولاً" });
        const decoded = jwt.verify(token, "your_jwt_secret");
        const userId = decoded.id;
        const friendId = req.query.friendId;
        const lastTimestamp = parseInt(req.query.lastTimestamp) || 0;

        if (!friendId) {
            return res.status(400).json({ error: "معرف الصديق مطلوب" });
        }

        const messages = await ChatModel.getMessagesAfterTimestamp(userId, friendId, lastTimestamp);
        
        const user = await ChatModel.getUserById(userId);
        const currentUserAvatar = user.avatar && user.avatar.startsWith('http') ? user.avatar : '/uploads/images/pngwing.com.png';

        const enrichedMessages = messages.map((message) => ({
            ...message,
            sender_avatar: message.sender_id.toString() === userId.toString()
              ? currentUserAvatar
              : (message.sender_avatar && message.sender_avatar.startsWith('http') ? message.sender_avatar : '/uploads/images/pngwing.com.png'),
          }));

        res.json(enrichedMessages);
    } catch (error) {
        logger.error("Error in getMessages:", error);
        res.status(500).json({ error: "خطأ في جلب الرسائل" });
    }
  }

  static async sendMessage(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: "يرجى تسجيل الدخول أولاً" });

      const decoded = jwt.verify(token, "your_jwt_secret");
      const senderId = decoded.id;
      const { receiverId, messageContent } = req.body;
      const imagePath = req.file ? req.file.path : null;

      if (!receiverId || (!messageContent?.trim() && !imagePath)) {
        return res.status(400).json({ error: "معرف المستلم أو المحتوى مطلوب" });
      }

      const isBlocked = await ChatModel.isUserBlocked(senderId, receiverId);
      if (isBlocked) {
        return res.status(403).json({ error: "لا يمكنك إرسال رسالة لأنك محظور" });
      }

      const message = await ChatModel.createMessage(senderId, receiverId, messageContent, imagePath);
      // Client will poll for new messages
      
      const sender = await ChatModel.getUserById(senderId);
      const senderAvatar = sender.avatar && sender.avatar.startsWith('http') ? sender.avatar : '/uploads/images/pngwing.com.png';
      
      res.status(201).json({ 
          success: true, 
          message: {
            ...message,
            sender_id: senderId,
            sender_name: sender.name,
            sender_avatar: senderAvatar,
            image_path: imagePath // ensure image_path is included
          }
      });
    } catch (error) {
      logger.error("Error in sendMessage:", error);
      res.status(500).json({ error: "خطأ في إرسال الرسالة" });
    }
  }

  static async deleteMessage(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: "يرجى تسجيل الدخول أولاً" });

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;
      const messageId = req.params.messageId;

      const message = await ChatModel.getMessageById(messageId);
      if (!message || (message.sender_id.toString() !== userId.toString() && message.receiver_id.toString() !== userId.toString())) {
        return res.status(403).json({ error: "غير مسموح لك بحذف هذه الرسالة" });
      }

      await ChatModel.deleteMessage(messageId);
      // No redirect, client will remove from UI
      res.json({ success: true, message: "تم حذف الرسالة بنجاح" });
    } catch (error) {
      logger.error("Error in deleteMessage:", error);
      res.status(500).json({ error: "حدث خطأ أثناء حذف الرسالة" });
    }
  }

  static async deleteAllMessages(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).send("يرجى تسجيل الدخول أولاً");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      await ChatModel.deleteAllMessages(userId);
      res.redirect("/messages"); // This might need to be an API response too
    } catch (error) {
      res.status(500).send("خطأ أثناء حذف جميع الرسائل");
    }
  }

  static async getAllReceivedMessagesPage(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).send("يرجى تسجيل الدخول أولاً");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const messages = await ChatModel.getReceivedMessages(userId);
      const currentUser = await ChatModel.getUserById(userId);
      const currentUserAvatar = currentUser?.avatar && currentUser.avatar.startsWith('http') ? currentUser.avatar : '/uploads/images/pngwing.com.png';
      const friendId = messages.length > 0
        ? messages[0].sender_id.toString() === userId.toString() ? messages[0].receiver_id : messages[0].sender_id
        : null;

      const filteredMessages = messages.filter(message => message.sender_id.toString() !== userId.toString());
      const latestMessages = filteredMessages.reduce((acc, message) => {
        acc[message.sender_id] = message;
        return acc;
      }, {});
      const enrichedMessages = Object.values(latestMessages).map(message => ({
        ...message,
        sender_avatar: message.sender_id.toString() === userId.toString()
          ? currentUserAvatar
          : (message.sender_avatar && message.sender_avatar.startsWith('http') ? message.sender_avatar : '/uploads/images/pngwing.com.png'),
      }));

      const unreadCount = await NotificationModel.getUnreadCount(userId);
      const unreadMessagesCount = await ChatModel.getUnreadCount(userId);

      res.render("messages", {
        messages: enrichedMessages,
        userId,
        friendId,
        currentUserAvatar,
        unreadCount,
        unreadMessagesCount,
        errorMessage: null,
      });
    } catch (error) {
      res.render("messages", {
        messages: [],
        userId: null,
        friendId: null,
        currentUserAvatar: "/uploads/images/pngwing.com.png",
        unreadCount: 0,
        unreadMessagesCount: 0,
        errorMessage: "حدث خطأ أثناء جلب الرسائل",
      });
    }
  }

  static async getLatestMessagesPage(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).send("يرجى تسجيل الدخول أولاً");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const currentUser = await ChatModel.getUserById(userId);
      const currentUserAvatar = currentUser?.avatar && currentUser.avatar.startsWith('http') ? currentUser.avatar : '/uploads/images/pngwing.com.png';

      const messages = await ChatModel.getLatestMessagesForFriends(userId);
      const enrichedMessages = messages
        .filter(message => message.sender_id.toString() !== userId.toString())
        .map(message => ({
          ...message,
          sender_avatar: message.sender_id.toString() === userId.toString()
            ? currentUserAvatar
            : (message.sender_avatar && message.sender_avatar.startsWith('http') ? message.sender_avatar : '/uploads/images/pngwing.com.png'),
        }));

      const unreadCount = await NotificationModel.getUnreadCount(userId);
      const unreadMessagesCount = await ChatModel.getUnreadCount(userId);

      res.render("messages", {
        messages: enrichedMessages,
        userId,
        currentUserAvatar,
        unreadCount,
        unreadMessagesCount,
        errorMessage: null,
      });
    } catch (error) {
      res.render("messages", {
        messages: [],
        userId: null,
        currentUserAvatar: "/uploads/images/pngwing.com.png",
        unreadCount: 0,
        unreadMessagesCount: 0,
        errorMessage: "حدث خطأ أثناء جلب الرسائل",
      });
    }
  }

  static async showMessages(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).send("يرجى تسجيل الدخول أولاً");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      await ChatModel.markAllAsRead(userId);
      const messages = await ChatModel.getReceivedMessages(userId);
      const unreadCount = await NotificationModel.getUnreadCount(userId);
      const unreadMessagesCount = await ChatModel.getUnreadCount(userId);
      const currentUser = await ChatModel.getUserById(userId);
      const currentUserAvatar = currentUser?.avatar && currentUser.avatar.startsWith('http') ? currentUser.avatar : '/uploads/images/pngwing.com.png';

      const filteredMessages = messages.filter(message => message.sender_id.toString() !== userId.toString());
      const latestMessages = filteredMessages.reduce((acc, message) => {
        acc[message.sender_id] = message;
        return acc;
      }, {});
      const enrichedMessages = Object.values(latestMessages).map(message => ({
        ...message,
        sender_avatar: message.sender_id.toString() === userId.toString()
          ? currentUserAvatar
          : (message.sender_avatar && message.sender_avatar.startsWith('http') ? message.sender_avatar : '/uploads/images/pngwing.com.png'),
      }));

      res.render("messages", {
        messages: enrichedMessages,
        unreadCount,
        unreadMessagesCount,
        userId,
        currentUserAvatar,
        errorMessage: null
      });
    } catch (error) {
      res.status(500).send("خطأ في عرض الرسائل");
    }
  }

  static async getMessagesPage(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).send("يرجى تسجيل الدخول أولاً");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      await ChatModel.markAllAsRead(userId);
      const messages = await ChatModel.getLatestMessagesForFriends(userId);
      const unreadCount = await NotificationModel.getUnreadCount(userId);
      const unreadMessagesCount = await ChatModel.getUnreadCount(userId);
      const currentUser = await ChatModel.getUserById(userId);
      const currentUserAvatar = currentUser?.avatar && currentUser.avatar.startsWith('http') ? currentUser.avatar : '/uploads/images/pngwing.com.png';

      const enrichedMessages = messages
        .filter(message => message.sender_id.toString() !== userId.toString())
        .map(message => ({
          ...message,
          sender_avatar: message.sender_id.toString() === userId.toString()
            ? currentUserAvatar
            : (message.sender_avatar && message.sender_avatar.startsWith('http') ? message.sender_avatar : '/uploads/images/pngwing.com.png'),
        }));

      res.render("messages", {
        messages: enrichedMessages,
        userId,
        currentUserAvatar,
        unreadCount,
        unreadMessagesCount,
        errorMessage: null,
      });
    } catch (error) {
      res.render("messages", {
        messages: [],
        userId: null,
        currentUserAvatar: "/uploads/images/pngwing.com.png",
        unreadCount: 0,
        unreadMessagesCount: 0,
        errorMessage: "حدث خطأ أثناء جلب الرسائل",
      });
    }
  }

  static async markAllAsRead(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ success: false, message: "يرجى تسجيل الدخول أولاً" });

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      await ChatModel.markAllAsRead(userId);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "خطأ أثناء تحديث حالة الرسائل" });
    }
  }

  static async markAsRead(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).send("يرجى تسجيل الدخول أولاً");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;
      const messageId = req.params.id;

      const message = await ChatModel.getMessageById(messageId);
      if (!message || message.receiver_id.toString() !== userId.toString()) {
        return res.status(403).send("غير مسموح لك بتحديث هذه الرسالة");
      }

      await ChatModel.markAsRead(messageId);
      res.redirect("/messages"); // This might need to be an API response too
    } catch (error) {
      res.status(500).send("خطأ أثناء تحديث حالة الرسالة");
    }
  }

  static async updateAvatar(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: "يرجى تسجيل الدخول أولاً" });

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;
      const newAvatar = req.file ? req.file.path : null;

      if (!newAvatar) return res.status(400).json({ error: "يجب تحميل صورة جديدة" });

      await ChatModel.updateUserAvatar(userId, newAvatar);
      res.status(200).json({ success: true, avatar: newAvatar });
    } catch (error) {
      logger.error("Error in updateAvatar:", error);
      res.status(500).json({ error: "خطأ في تحديث الصورة الرمزية" });
    }
  }

  static async getUnreadMessagesCount(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: "يرجى تسجيل الدخول أولاً" });

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const count = await ChatModel.getUnreadCount(userId);
      res.json({ count });
    } catch (error) {
      logger.error("Error in getUnreadMessagesCount:", error);
      res.status(500).json({ error: "خطأ في جلب عدد الرسائل غير المقروءة" });
    }
  }

  static async getAvatarUpdates(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: "يرجى تسجيل الدخول أولاً" });

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId1 = decoded.id;
      const userId2 = req.query.userId2;

      if (!userId2) {
        return res.status(400).json({ error: "معرف المستخدم الثاني مطلوب" });
      }

      const updates = await ChatModel.getAvatarUpdates(userId1, userId2);
      res.json(updates);
    } catch (error) {
      logger.error("Error in getAvatarUpdates:", error);
      res.status(500).json({ error: "خطأ في جلب تحديثات الصور الرمزية" });
    }
  }
}

module.exports = ChatController;
