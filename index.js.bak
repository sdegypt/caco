const express = require("express");
const http = require("http");
const path = require("path");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const compression = require("compression");
const minify = require("express-minify");
const cron = require("node-cron");
const NotificationModel = require("./models/NotificationModel");
const logger = require("./config/logger");
const expressStatusMonitor = require("express-status-monitor");
const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");

const ForumModel = require("./models/forumModel"); // تأكد من صحة اسم الملف

// استيراد الراوترات
const userRouter = require("./router/UsersRouter");
const forumRouter = require("./router/forumRoutes");
const MessagesProjectRoutes = require("./router/messagesProjectRoutes");
const friendshipRoutes = require("./routes/friends");
const notificationRouter = require("./router/notificationRoutes");
const chatRoutes = require("./router/chatRoutes");
const jobRoutes = require("./router/jobRoutes");
const profileRouter = require("./router/profileRouter");
const ProjectRoutes = require("./router/ProjectRoutes");
const contactRoutes = require("./router/contactRoutes");
const adminMessageRoutes = require("./router/adminMessageRoutes");
const adminDashboardRoutes = require("./router/adminDashboardRoutes");
const adminStatisticsRoutes = require("./router/adminStatisticsRoutes");
const adminSiteStatsRoutes = require("./router/adminSiteStatsRoutes");
const adminRolesPermissionsRoutes = require("./router/adminRolesPermissionsRoutes");
const adminForumSettingsRoutes = require("./router/adminForumSettingsRoutes");
const adminJobProjectSettingsRoutes = require("./router/adminJobProjectSettingsRoutes");
const adminUsersRoutes = require("./router/adminUsersRoutes");
const changePasswordRoutes = require("./router/changePasswordRoutes");
const storeRoutes = require("./router/StoreRoutes");
const errorHandler = require("./middleware/errorHandler");
const GlobalRoleController = require("./controllers/GlobalRoleController");
const ForumController = require("./controllers/ForumController");
const ImageOptimizationMiddleware = require("./middleware/imageOptimization");

// استيراد الميدلوير الجديد للميتا الديناميكية
const dynamicMetaMiddleware = require("./middleware/dynamicMetaMiddleware");

const app = express();
const server = http.createServer(app);

// إنشاء instance من middleware تحسين الصور
const imageOptimizer = new ImageOptimizationMiddleware();

// تفعيل الضغط مع إعدادات محسنة
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// تفعيل تصغير الملفات (CSS, JS) مع إعدادات محسنة
app.use(minify({
  cache: false,
  uglifyJsModule: null,
  errorHandler: null,
  jsMatch: /\.js$/,
  cssMatch: /\.css$/,
  jsonMatch: /\.json$/,
  sassMatch: /\.scss$/,
  lessMatch: /\.less$/,
  stylusMatch: /\.styl$/,
  coffeeMatch: /\.coffee$/
}));

app.use(expressStatusMonitor());

// إعداد التخزين للملفات المرفوعة
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 ميجابايت
});

// إعدادات البرامج الوسيطة
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: "your_jwt_secret",
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 ساعة
  }
}));
app.use(flash());

// تمرير رسائل الفلاش لكل الصفحات
app.use((req, res, next) => {
  res.locals.flash = {
    success: req.flash('success'),
    error: req.flash('error')
  };
  next();
});

// إعداد محرك العرض
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// إعداد الملفات الثابتة مع تحسين الصور
app.use('/uploads', imageOptimizer.serveOptimizedImages());
app.use(express.static(path.join(__dirname, "public"), {
  maxAge: '1y', // سنة واحدة للملفات الثابتة
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // إعدادات مخصصة للملفات المختلفة
    if (path.endsWith('.css') || path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // سنة واحدة
    } else if (path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.gif') || path.endsWith('.webp')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // سنة واحدة للصور
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400'); // يوم واحد للملفات الأخرى
    }
  }
}));

// إضافة middleware تحسين الصور للملفات المرفوعة
app.use(imageOptimizer.optimizeImages());

// إزالة مسار uploads بسبب القيود على Vercel
// استخدام التخزين السحابي للملفات المرفوعة

// إضافة الميدلوير للميتا الديناميكية
app.use(dynamicMetaMiddleware);

// Middleware لحساب unreadCount وتمريره لكل الصفحات
app.use(async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const unreadCount = await NotificationModel.getUnreadCount(req.session.userId);
      res.locals.unreadCount = unreadCount || 0;
    } catch (err) {
      logger.error("خطأ أثناء حساب unreadCount:", err);
    }
  } else {
    res.locals.unreadCount = 0;
  }
  next();
});

// Middleware عالمي للتحقق من الدور
app.use(GlobalRoleController.setGlobalRole);

// الصفحة الرئيسية - المنتدى
app.get("/", ForumController.getAllPosts);

// دمج الراوترات
app.use("/", userRouter);
app.use("/", changePasswordRoutes);
app.use("/friends", friendshipRoutes);
app.use(notificationRouter);
app.use("/forum", forumRouter);
app.use("/", chatRoutes);
app.use("/", jobRoutes);
app.use("/", profileRouter);
app.use("/projects", ProjectRoutes);
app.use("/", MessagesProjectRoutes);
app.use("/", contactRoutes);
app.use("/stores", storeRoutes);
app.use("/admin", adminMessageRoutes);
app.use("/admin", adminDashboardRoutes);
app.use("/admin", adminStatisticsRoutes);
app.use("/admin", adminSiteStatsRoutes);
app.use("/admin", adminRolesPermissionsRoutes);
app.use("/admin", adminForumSettingsRoutes);
app.use("/admin", adminJobProjectSettingsRoutes);
app.use("/admin", adminUsersRoutes);
app.use("/", require("./router/GlobalRoleRouter"));

// مسارات ثابتة للصفحات
app.get('/about', (req, res) => {
  res.locals.pageName = 'about';
  res.render('about', {
    unreadCount: res.locals.unreadCount,
    userId: res.locals.userId,
    isAdmin: res.locals.isAdmin
  });
});

app.get('/privacy', (req, res) => {
  res.locals.pageName = 'privacy';
  res.render('privacy', {
    unreadCount: res.locals.unreadCount,
    userId: res.locals.userId,
    isAdmin: res.locals.isAdmin
  });
});

// مسار مستقل لـ /ProjectSpace
app.get("/ProjectSpace", (req, res) => {
  res.locals.pageName = 'ProjectSpace';
  res.render("ProjectSpace", {
    errorMessage: null,
    successMessage: null,
    userId: res.locals.userId,
    isAdmin: res.locals.isAdmin,
    unreadCount: res.locals.unreadCount
  });
});

// مسار السايت ماب الديناميكي
app.get('/sitemap.xml', async (req, res) => {
  try {
    const posts = await ForumModel.getAllPosts(null);
    const links = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/about', changefreq: 'monthly', priority: 0.7 },
      { url: '/privacy', changefreq: 'yearly', priority: 0.5 },
      ...posts.map(post => ({
        url: `/forum/post/${post.id}`,
        changefreq: 'weekly',
        priority: 0.8
      }))
    ];

    const stream = new SitemapStream({ hostname: 'https://www.amlhabrak.online' });
    res.writeHead(200, {
      'Content-Type': 'application/xml'
    });

    const xmlString = await streamToPromise(Readable.from(links).pipe(stream)).then(data => data.toString());
    res.end(xmlString);

  } catch (e) {
    console.error('خطأ في توليد السايت ماب:', e);
    res.status(500).end();
  }
});

// جدولة حذف الإعلانات القديمة يومياً
cron.schedule('0 0 * * *', async () => {
  try {
    await ForumModel.deleteOldAds();
    console.log('تم حذف الإعلانات القديمة بنجاح.');
  } catch (err) {
    logger.error("خطأ في حذف الإعلانات المجدولة:", err);
  }
}, {
  scheduled: true,
  timezone: "Asia/Riyadh"
});

// Middleware لمعالجة الأخطاء (في النهاية)
app.use(errorHandler);

// إعداد socket.io
const { Server } = require('socket.io');
const chatModel = require('./models/chatModel');
const UsersModels = require('./models/UsersModels');

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

const userSocketMap = new Map();

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join_chat', ({ userId, friendId }) => {
    console.log(`User ${userId} joined chat with ${friendId}. Socket: ${socket.id}`);
    socket.join(userId);
    socket.userId = userId;
    userSocketMap.set(userId, socket.id);
  });

  socket.on('send_message', async (messageData) => {
    console.log('Received send_message:', messageData);
    try {
      io.to(messageData.sender_id).emit('new_message', messageData);
      io.to(messageData.receiver_id).emit('new_message', messageData);
    } catch (err) {
      console.error('Socket send_message error:', err);
    }
  });

  socket.on('delete_message', async (messageId) => {
    console.log('Received delete_message for ID:', messageId);
    try {
      const message = await chatModel.getMessageById(messageId);
      if (message) {
        const deleted = await chatModel.deleteMessage(messageId);
        if (deleted) {
          io.to(message.sender_id).emit('message_deleted', messageId);
          io.to(message.receiver_id).emit('message_deleted', messageId);
        }
      }
    } catch (err) {
      console.error('Socket delete_message error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
    for (let [key, value] of userSocketMap.entries()) {
      if (value === socket.id) {
        userSocketMap.delete(key);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
