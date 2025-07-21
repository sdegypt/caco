// Service Worker مع استراتيجيات الكاش المحسنة
const CACHE_NAME = 'amlhabrak-v4.0.0'; // تحديث رقم الإصدار لضمان تحديث الكاش
const STATIC_CACHE = 'static-v4.0.0';
const DYNAMIC_CACHE = 'dynamic-v4.0.0';
const offlineFallbackPage = "/offline.html";

// قائمة الملفات المهمة للتخزين المؤقت
const STATIC_FILES = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/public/css/style.css',
  '/public/js/main.js',
  '/public/icons/icon-192x192-new.png',
  '/public/icons/icon-512x512-new.png'
];

// تفعيل skipWaiting فوراً عند التثبيت
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // تخزين الملفات الثابتة
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      }),
      // تفعيل skipWaiting فوراً
      self.skipWaiting()
    ])
  );
});

// تفعيل clientsClaim فوراً عند التنشيط
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // حذف الكاش القديم
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // تفعيل clientsClaim فوراً
      self.clients.claim()
    ])
  );
});

// معالجة رسائل من الصفحة الرئيسية
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// استراتيجية fetch محسنة
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // تجاهل الطلبات غير HTTP/HTTPS
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // استراتيجية خاصة للصفحات
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // استراتيجية للملفات الثابتة (CSS, JS, Images)
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }
  
  // استراتيجية للطلبات الديناميكية
  event.respondWith(handleDynamicRequest(request));
});

// معالجة طلبات التنقل (الصفحات)
async function handleNavigationRequest(request) {
  try {
    // محاولة الحصول على الصفحة من الشبكة أولاً
    const networkResponse = await fetch(request);
    
    // تخزين الصفحة في الكاش الديناميكي
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // في حالة عدم توفر الشبكة، البحث في الكاش
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // إرجاع صفحة offline كحل أخير
    return caches.match(offlineFallbackPage);
  }
}

// معالجة الملفات الثابتة
async function handleStaticAsset(request) {
  // البحث في الكاش أولاً
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // إذا لم توجد في الكاش، جلبها من الشبكة
    const networkResponse = await fetch(request);
    
    // تخزينها في الكاش الثابت
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // في حالة الفشل، إرجاع استجابة فارغة
    return new Response('', { status: 404 });
  }
}

// معالجة الطلبات الديناميكية
async function handleDynamicRequest(request) {
  try {
    // محاولة الحصول من الشبكة أولاً
    const networkResponse = await fetch(request);
    
    // تخزين في الكاش الديناميكي مع حد أقصى للحجم
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    
    // تنظيف الكاش الديناميكي إذا تجاوز الحد المسموح
    limitCacheSize(DYNAMIC_CACHE, 50);
    
    return networkResponse;
  } catch (error) {
    // البحث في الكاش كحل بديل
    return caches.match(request);
  }
}

// فحص ما إذا كان الطلب لملف ثابت
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/);
}

// تحديد حجم الكاش
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxItems) {
    // حذف أقدم العناصر
    const itemsToDelete = keys.slice(0, keys.length - maxItems);
    await Promise.all(itemsToDelete.map(key => cache.delete(key)));
  }
}

// إشعار العميل بتوفر تحديث جديد
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_UPDATE') {
    // فحص وجود تحديث جديد
    self.registration.update().then(() => {
      event.ports[0].postMessage({ hasUpdate: true });
    });
  }
});

