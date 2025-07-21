// PWA Installation and Service Worker Registration
class PWAInstaller {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.init();
  }

  init() {
    // تسجيل Service Worker
    this.registerServiceWorker();
    
    // إعداد مستمعات الأحداث
    this.setupEventListeners();
    
    // فحص حالة التثبيت
    this.checkInstallationStatus();
    
    // إعداد زر التثبيت
    this.setupInstallButton();
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        console.log('Service Worker registered successfully:', registration);
        
        // التحقق من التحديثات
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateNotification();
            }
          });
        });
        
        // إعادة تحميل الصفحة عند تفعيل Service Worker جديد
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });
        
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  setupEventListeners() {
    // حفظ حدث التثبيت
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    // تتبع التثبيت الناجح
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed successfully');
      this.isInstalled = true;
      this.hideInstallButton();
      this.showInstalledNotification();
    });

    // معالجة تغيير حالة الشبكة
    window.addEventListener('online', () => {
      this.showNetworkStatus('متصل', 'success');
    });

    window.addEventListener('offline', () => {
      this.showNetworkStatus('غير متصل - يعمل في وضع عدم الاتصال', 'warning');
    });
  }

  checkInstallationStatus() {
    // فحص إذا كان التطبيق مثبت بالفعل
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      this.isInstalled = true;
      console.log('App is running in standalone mode');
    }
  }

  setupInstallButton() {
    // إنشاء زر التثبيت
    const installButton = document.createElement('button');
    installButton.id = 'pwa-install-btn';
    installButton.innerHTML = `
      <i class="fas fa-download"></i>
      <span>تثبيت التطبيق</span>
    `;
    installButton.className = 'pwa-install-button hidden';
    installButton.addEventListener('click', () => this.installApp());
    
    // إضافة الزر إلى الصفحة
    document.body.appendChild(installButton);
    
    // إضافة الأنماط
    this.addInstallButtonStyles();
  }

  addInstallButtonStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .pwa-install-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b35, #f7931e);
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: 'Cairo', sans-serif;
      }
      
      .pwa-install-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 25px rgba(255, 107, 53, 0.4);
      }
      
      .pwa-install-button.hidden {
        display: none;
      }
      
      .pwa-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 12px;
        padding: 16px 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        max-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: 'Cairo', sans-serif;
      }
      
      .pwa-notification.show {
        transform: translateX(0);
      }
      
      .pwa-notification.success {
        border-left: 4px solid #4CAF50;
      }
      
      .pwa-notification.warning {
        border-left: 4px solid #FF9800;
      }
      
      .pwa-notification.info {
        border-left: 4px solid #2196F3;
      }
      
      .network-status {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: 8px;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        z-index: 1002;
        transform: translateY(-100%);
        transition: transform 0.3s ease;
      }
      
      .network-status.show {
        transform: translateY(0);
      }
      
      .network-status.success {
        background: #4CAF50;
        color: white;
      }
      
      .network-status.warning {
        background: #FF9800;
        color: white;
      }
      
      @media (max-width: 768px) {
        .pwa-install-button {
          bottom: 80px;
          right: 15px;
          padding: 10px 16px;
          font-size: 13px;
        }
        
        .pwa-notification {
          top: 15px;
          right: 15px;
          left: 15px;
          max-width: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  showInstallButton() {
    const button = document.getElementById('pwa-install-btn');
    if (button && !this.isInstalled) {
      button.classList.remove('hidden');
    }
  }

  hideInstallButton() {
    const button = document.getElementById('pwa-install-btn');
    if (button) {
      button.classList.add('hidden');
    }
  }

  async installApp() {
    if (!this.deferredPrompt) {
      this.showNotification('التثبيت غير متاح حالياً', 'warning');
      return;
    }

    try {
      // إظهار مربع حوار التثبيت
      this.deferredPrompt.prompt();
      
      // انتظار اختيار المستخدم
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        this.showNotification('جاري تثبيت التطبيق...', 'info');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // إعادة تعيين المتغير
      this.deferredPrompt = null;
      this.hideInstallButton();
      
    } catch (error) {
      console.error('Error during installation:', error);
      this.showNotification('حدث خطأ أثناء التثبيت', 'warning');
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `pwa-notification ${type}`;
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <i class="fas ${this.getIconForType(type)}"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // إظهار الإشعار
    setTimeout(() => notification.classList.add('show'), 100);
    
    // إخفاء الإشعار بعد 3 ثوان
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'pwa-notification info';
    notification.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <i class="fas fa-sync-alt"></i>
          <span>تحديث جديد متاح</span>
        </div>
        <button onclick="window.location.reload()" style="background: #2196F3; color: white; border: none; border-radius: 6px; padding: 6px 12px; cursor: pointer;">
          تحديث
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
  }

  showInstalledNotification() {
    this.showNotification('تم تثبيت التطبيق بنجاح! 🎉', 'success');
  }

  showNetworkStatus(message, type) {
    let statusBar = document.getElementById('network-status');
    
    if (!statusBar) {
      statusBar = document.createElement('div');
      statusBar.id = 'network-status';
      statusBar.className = 'network-status';
      document.body.appendChild(statusBar);
    }
    
    statusBar.textContent = message;
    statusBar.className = `network-status ${type} show`;
    
    // إخفاء شريط الحالة بعد 3 ثوان
    setTimeout(() => {
      statusBar.classList.remove('show');
    }, 3000);
  }

  getIconForType(type) {
    const icons = {
      success: 'fa-check-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle',
      error: 'fa-times-circle'
    };
    return icons[type] || icons.info;
  }

  // طرق إضافية لتحسين تجربة PWA
  enablePushNotifications() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Push notifications enabled');
          this.showNotification('تم تفعيل الإشعارات', 'success');
        }
      });
    }
  }

  shareApp() {
    if (navigator.share) {
      navigator.share({
        title: 'DIY - منصة الإبداع والتصميم',
        text: 'اكتشف منصة DIY للإبداع والتصميم',
        url: window.location.origin
      });
    } else {
      // نسخ الرابط إلى الحافظة
      navigator.clipboard.writeText(window.location.origin).then(() => {
        this.showNotification('تم نسخ الرابط', 'success');
      });
    }
  }
}

// تهيئة PWA عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  window.pwaInstaller = new PWAInstaller();
});

// تصدير للاستخدام العام
window.PWAInstaller = PWAInstaller;

