// Service Worker محسن لـ PWA اعملها براك
const CACHE_NAME = 'amlhabrak-v4.0.0';
const STATIC_CACHE = 'static-v4.0.0';
const DYNAMIC_CACHE = 'dynamic-v4.0.0';
const offlineFallbackPage = "/offline.html";

// قائمة الملفات المهمة للتخزين المؤقت
const STATIC_FILES = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/css/style.css',
  '/js/main.js',
  '/icons/icon-192x192-new.png',
  '/icons/icon-512x512-new.png',
  '/icons/icon-384x384-new.png',
  '/icons/icon-152x152-new.png',
  '/icons/icon-144x144-new.png',
  '/icons/icon-128x128-new.png',
  '/icons/icon-92x92-new.png',
  '/icons/icon-72x72-new.png'
];

// تثبيت Service Worker مع skipWaiting
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing v4.0.0...');
  
  event.waitUntil(
    Promise.all([
      // تخزين الملفات الثابتة
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES.filter(url => url !== '/')).catch(err => {
          console.warn('Some files failed to cache:', err);
          // تخزين الملفات الأساسية على الأقل
          return cache.addAll(['/offline.html', '/manifest.json']);
        });
      }),
      // تفعيل skipWaiting فوراً
      self.skipWaiting()
    ])
  );
});

// تنشيط Service Worker مع clientsClaim
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating v4.0.0...');
  
  event.waitUntil(
    Promise.all([
      // حذف الكاش القديم
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== CACHE_NAME) {
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
  
  // إشعار جميع العملاء بالتحديث
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_UPDATED',
        version: CACHE_NAME
      });
    });
  });
});

// معالجة الرسائل
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'FORCE_UPDATE') {
    // فرض تحديث الكاش
    caches.keys().then(cacheNames => {
      return Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
    }).then(() => {
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.navigate(client.url));
      });
    });
  }
});

// استراتيجية fetch محسنة
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // تجاهل الطلبات غير HTTP/HTTPS
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // تجاهل طلبات POST وPUT وDELETE
  if (request.method !== 'GET') {
    return;
  }
  
  // استراتيجية خاصة للصفحات
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // استراتيجية للملفات الثابتة
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }
  
  // استراتيجية للطلبات الديناميكية
  event.respondWith(handleDynamicRequest(request));
});

// معالجة طلبات التنقل
async function handleNavigationRequest(request) {
  try {
    // محاولة الحصول على الصفحة من الشبكة أولاً
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // تخزين الصفحة في الكاش الديناميكي
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('Network failed for navigation:', error);
  }
  
  // البحث في الكاش
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // إرجاع صفحة offline
  return caches.match(offlineFallbackPage) || new Response('Offline', { status: 503 });
}

// معالجة الملفات الثابتة
async function handleStaticAsset(request) {
  // البحث في الكاش أولاً (Cache First)
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // جلب من الشبكة وتخزين
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Failed to fetch static asset:', request.url);
    return new Response('', { status: 404 });
  }
}

// معالجة الطلبات الديناميكية
async function handleDynamicRequest(request) {
  try {
    // الشبكة أولاً للمحتوى الديناميكي
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // تخزين في الكاش الديناميكي
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      
      // تنظيف الكاش
      limitCacheSize(DYNAMIC_CACHE, 50);
    }
    
    return networkResponse;
  } catch (error) {
    // البحث في الكاش كحل بديل
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// فحص الملفات الثابتة
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|webp)$/i) ||
         url.pathname.includes('/icons/') ||
         url.pathname.includes('/images/') ||
         url.pathname.includes('/css/') ||
         url.pathname.includes('/js/');
}

// تحديد حجم الكاش
async function limitCacheSize(cacheName, maxItems) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length > maxItems) {
      const itemsToDelete = keys.slice(0, keys.length - maxItems);
      await Promise.all(itemsToDelete.map(key => cache.delete(key)));
      console.log(`Cleaned ${itemsToDelete.length} items from ${cacheName}`);
    }
  } catch (error) {
    console.warn('Failed to limit cache size:', error);
  }
}

