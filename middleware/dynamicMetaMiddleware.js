/**
 * وسيط لإضافة بيانات الميتا الديناميكية إلى جميع الطلبات
 * 
 * هذا الملف يقوم بإضافة وظائف توليد الميتا الديناميكية إلى كائن res.locals
 * ليتم استخدامها في جميع قوالب EJS
 */

const metaUtils = require('../utils/dynamicMetaUtils');

/**
 * وسيط Express لإضافة وظائف الميتا الديناميكية إلى res.locals
 */
function dynamicMetaMiddleware(req, res, next) {
  // إضافة وظائف الميتا إلى res.locals
  res.locals.metaUtils = metaUtils;
  
  // تحديد المسار الحالي للصفحة
  const path = req.path;
  let pageName = 'default';
  
  // تحديد اسم الصفحة بناءً على المسار
  if (path === '/') {
    pageName = 'home';
  } else if (path.startsWith('/forum')) {
    pageName = 'forum';
  } else if (path.startsWith('/profile')) {
    pageName = 'profile';
  } else if (path.startsWith('/projects')) {
    pageName = 'projects';
  } else if (path.startsWith('/jobs')) {
    pageName = 'jobs';
  } else if (path === '/about') {
    pageName = 'about';
  } else if (path === '/privacy') {
    pageName = 'privacy';
  } else if (path === '/contact') {
    pageName = 'contact';
  } else if (path === '/login') {
    pageName = 'login';
  } else if (path === '/signup') {
    pageName = 'signup';
  } else if (path.startsWith('/post/')) {
    pageName = 'postDetails';
  } else if (path.startsWith('/job/')) {
    pageName = 'jobDetail';
  } else if (path.startsWith('/project/')) {
    pageName = 'project-details';
  } else if (path.startsWith('/messages')) {
    pageName = 'messages';
  } else if (path.startsWith('/notifications')) {
    pageName = 'notifications';
  } else if (path.startsWith('/admin')) {
    pageName = 'admin';
  }
  
  // إضافة اسم الصفحة إلى res.locals
  res.locals.pageName = pageName;
  
  // إضافة بيانات الصفحة الافتراضية
  res.locals.pageData = {
    url: `https://www.aemelhabarak.com${path}`
  };
  
  // استمرار سلسلة الوسطاء
  next();
}

module.exports = dynamicMetaMiddleware;
