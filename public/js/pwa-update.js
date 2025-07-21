/**
 * PWA Update Manager
 * يدير تحديثات Progressive Web App ومسح الكاش
 */

class PWAUpdateManager {
    constructor() {
        this.version = '1.0.1';
        this.cacheName = 'diy-v1.0.1';
        this.init();
    }

    /**
     * تهيئة مدير التحديثات
     */
    init() {
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
            this.checkForUpdates();
            this.setupUpdateNotification();
        }
    }

    /**
     * تسجيل Service Worker
     */
    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered successfully:', registration);
            
            // التحقق من وجود تحديث
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        this.showUpdateNotification();
                    }
                });
            });
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    /**
     * التحقق من وجود تحديثات
     */
    async checkForUpdates() {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                registration.update();
            }
        }
    }

    /**
     * مسح جميع الكاش المحفوظ
     */
    async clearAllCache() {
        try {
            const cacheNames = await caches.keys();
            const deletePromises = cacheNames.map(cacheName => caches.delete(cacheName));
            await Promise.all(deletePromises);
            console.log('All caches cleared successfully');
            return true;
        } catch (error) {
            console.error('Error clearing cache:', error);
            return false;
        }
    }

    /**
     * مسح كاش محدد
     */
    async clearSpecificCache(cacheName) {
        try {
            const deleted = await caches.delete(cacheName);
            if (deleted) {
                console.log(`Cache ${cacheName} cleared successfully`);
            }
            return deleted;
        } catch (error) {
            console.error(`Error clearing cache ${cacheName}:`, error);
            return false;
        }
    }

    /**
     * إجبار تحديث الصفحة مع مسح الكاش
     */
    async forceUpdate() {
        try {
            // مسح جميع الكاش
            await this.clearAllCache();
            
            // إلغاء تسجيل Service Worker القديم
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (let registration of registrations) {
                    await registration.unregister();
                }
            }
            
            // إعادة تحميل الصفحة مع تجاهل الكاش
            window.location.reload(true);
        } catch (error) {
            console.error('Error during force update:', error);
            // إعادة تحميل عادية في حالة الخطأ
            window.location.reload();
        }
    }

    /**
     * إعداد إشعار التحديث
     */
    setupUpdateNotification() {
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.id = 'pwa-update-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #FF6B00;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: none;
            font-family: 'Cairo', sans-serif;
            max-width: 300px;
            direction: rtl;
        `;
        
        notification.innerHTML = `
            <div style="margin-bottom: 10px;">
                <strong>تحديث جديد متاح!</strong>
            </div>
            <div style="margin-bottom: 15px; font-size: 14px;">
                يتوفر إصدار جديد من التطبيق مع أيقونات محدثة
            </div>
            <div>
                <button id="update-now-btn" style="
                    background: white;
                    color: #FF6B00;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-left: 10px;
                    font-weight: bold;
                ">تحديث الآن</button>
                <button id="update-later-btn" style="
                    background: transparent;
                    color: white;
                    border: 1px solid white;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                ">لاحقاً</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // إضافة مستمعي الأحداث
        document.getElementById('update-now-btn').addEventListener('click', () => {
            this.forceUpdate();
        });
        
        document.getElementById('update-later-btn').addEventListener('click', () => {
            notification.style.display = 'none';
        });
    }

    /**
     * إظهار إشعار التحديث
     */
    showUpdateNotification() {
        const notification = document.getElementById('pwa-update-notification');
        if (notification) {
            notification.style.display = 'block';
        }
    }

    /**
     * التحقق من إصدار الكاش المحفوظ
     */
    async checkCacheVersion() {
        try {
            const savedVersion = localStorage.getItem('pwa-version');
            if (savedVersion !== this.version) {
                console.log('New version detected, clearing cache...');
                await this.clearAllCache();
                localStorage.setItem('pwa-version', this.version);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error checking cache version:', error);
            return false;
        }
    }

    /**
     * إضافة query string للأصول لتجنب الكاش
     */
    addCacheBuster() {
        const version = this.version;
        const links = document.querySelectorAll('link[rel="stylesheet"], link[rel="icon"], link[rel="apple-touch-icon"]');
        const scripts = document.querySelectorAll('script[src]');
        const images = document.querySelectorAll('img[src]');
        
        // تحديث CSS
        links.forEach(link => {
            if (link.href && !link.href.includes('?v=')) {
                link.href += `?v=${version}`;
            }
        });
        
        // تحديث JavaScript
        scripts.forEach(script => {
            if (script.src && !script.src.includes('?v=')) {
                script.src += `?v=${version}`;
            }
        });
        
        // تحديث الصور
        images.forEach(img => {
            if (img.src && !img.src.includes('?v=')) {
                img.src += `?v=${version}`;
            }
        });
    }

    /**
     * إنشاء زر مسح الكاش يدوياً (للمطورين)
     */
    createClearCacheButton() {
        const button = document.createElement('button');
        button.textContent = 'مسح الكاش وإعادة التحميل';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: #dc3545;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
            font-family: 'Cairo', sans-serif;
            display: none;
        `;
        
        button.addEventListener('click', () => {
            this.forceUpdate();
        });
        
        document.body.appendChild(button);
        
        // إظهار الزر في وضع التطوير فقط
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            button.style.display = 'block';
        }
    }
}

// تهيئة مدير التحديثات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.pwaUpdateManager = new PWAUpdateManager();
    
    // التحقق من إصدار الكاش
    window.pwaUpdateManager.checkCacheVersion();
    
    // إضافة cache buster للأصول
    window.pwaUpdateManager.addCacheBuster();
    
    // إنشاء زر مسح الكاش للمطورين
    window.pwaUpdateManager.createClearCacheButton();
});

// إضافة دوال عامة للاستخدام من وحدة التحكم
window.clearPWACache = () => {
    if (window.pwaUpdateManager) {
        return window.pwaUpdateManager.clearAllCache();
    }
};

window.forcePWAUpdate = () => {
    if (window.pwaUpdateManager) {
        return window.pwaUpdateManager.forceUpdate();
    }
};

window.checkPWAUpdates = () => {
    if (window.pwaUpdateManager) {
        return window.pwaUpdateManager.checkForUpdates();
    }
};

