const CACHE_VERSION = 'v5.0.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const OFFLINE_PAGE = '/offline.html';

const STATIC_FILES = [
  '/',
  OFFLINE_PAGE,
  '/manifest.json',
  '/public/css/style.css',
  '/public/js/main.js',
  '/public/icons/icon-192x192-new.png',
  '/public/icons/icon-512x512-new.png',
];

// التثبيت وتخزين الملفات الأساسية
self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_FILES);
    }).then(() => self.skipWaiting())
  );
});

// التفعيل وحذف الكاشات القديمة
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (![STATIC_CACHE, DYNAMIC_CACHE].includes(key)) {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// جلب الملفات
self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (!request.url.startsWith('http')) return;

  if (request.mode === 'navigate') {
    event.respondWith(navigateHandler(request));
    return;
  }

  if (isStaticAsset(request)) {
    event.respondWith(staticHandler(request));
    return;
  }

  event.respondWith(dynamicHandler(request));
});

// 🧠 الإستراتيجيات
async function navigateHandler(request) {
  try {
    const res = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, res.clone());
    return res;
  } catch {
    const cached = await caches.match(request);
    return cached || caches.match(OFFLINE_PAGE);
  }
}

async function staticHandler(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const res = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, res.clone());
    return res;
  } catch {
    return new Response('', { status: 404 });
  }
}

async function dynamicHandler(request) {
  try {
    const res = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, res.clone());
    limitCacheSize(DYNAMIC_CACHE, 50);
    return res;
  } catch {
    return caches.match(request);
  }
}

function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(css|js|png|jpg|jpeg|svg|ico|woff2?|ttf|eot)$/);
}

async function limitCacheSize(name, maxItems) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    return limitCacheSize(name, maxItems);
  }
}

// تحديث إجباري
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data?.type === 'CHECK_UPDATE') {
    self.registration.update().then(() => {
      event.ports[0].postMessage({ hasUpdate: true });
    });
  }

  if (event.data?.type === 'CLEAR_CACHES') {
    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key));
    });
  }
});
