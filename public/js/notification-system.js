/**
 * نظام الإشعارات المنبثقة الذكي
 * يدعم RTL/LTR ويحفظ حالة الإغلاق في localStorage
 */

class NotificationSystem {
  constructor() {
    this.storageKey = 'notification_dismissed';
    this.showDelay = 3000; // 3 ثوانٍ
    this.hideDelay = 300; // مدة الاختفاء
    this.dismissDuration = 24 * 60 * 60 * 1000; // 24 ساعة بالميلي ثانية
    
    this.init();
  }

  init() {
    // التحقق من حالة الإغلاق السابقة
    if (this.isDismissed()) {
      return;
    }

    // إنشاء الإشعار بعد تحميل الصفحة
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => this.createNotification(), this.showDelay);
      });
    } else {
      setTimeout(() => this.createNotification(), this.showDelay);
    }
  }

  isDismissed() {
    const dismissedTime = localStorage.getItem(this.storageKey);
    if (!dismissedTime) return false;
    
    const now = Date.now();
    const timeDiff = now - parseInt(dismissedTime);
    
    // إذا مرت 24 ساعة، احذف البيانات المحفوظة
    if (timeDiff >= this.dismissDuration) {
      localStorage.removeItem(this.storageKey);
      return false;
    }
    
    return true;
  }

  createNotification() {
    // التحقق مرة أخرى قبل الإنشاء
    if (this.isDismissed()) return;

    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    // تحديد اتجاه النص
    const isRTL = document.dir === 'rtl' || document.documentElement.dir === 'rtl' || 
                  document.body.dir === 'rtl' || this.detectRTL();
    
    if (isRTL) {
      notification.setAttribute('dir', 'rtl');
    }

    // محتوى الإشعار
    const content = this.getNotificationContent(isRTL);
    notification.innerHTML = content;

    // إضافة الإشعار للصفحة
    document.body.appendChild(notification);

    // إضافة مستمع الأحداث لزر الإغلاق
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.dismissNotification(notification);
      });
    }

    // إضافة مستمع للنقر على الإشعار نفسه (اختياري)
    notification.addEventListener('click', (e) => {
      if (e.target !== closeBtn) {
        this.handleNotificationClick();
      }
    });

    // إظهار الإشعار
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // إخفاء الإشعار تلقائياً بعد 10 ثوانٍ (اختياري)
    setTimeout(() => {
      if (notification.parentNode) {
        this.dismissNotification(notification);
      }
    }, 10000);
  }

  getNotificationContent(isRTL) {
    const messages = {
      rtl: {
        text: '🎉 عرض خاص! احصل على خصم 20% على جميع الخدمات المميزة',
        closeLabel: 'إغلاق الإشعار'
      },
      ltr: {
        text: '🎉 Special Offer! Get 20% off on all premium services',
        closeLabel: 'Close notification'
      }
    };

    const msg = isRTL ? messages.rtl : messages.ltr;

    return `
      <div class="notification-content">
        <div class="notification-icon">
          <span>!</span>
        </div>
        <p class="notification-text">${msg.text}</p>
      </div>
      <button class="notification-close" aria-label="${msg.closeLabel}" title="${msg.closeLabel}">
        ×
      </button>
    `;
  }

  detectRTL() {
    // كشف اللغة العربية أو العبرية أو الفارسية
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    const lang = document.documentElement.lang || navigator.language || 'en';
    return rtlLanguages.some(rtlLang => lang.startsWith(rtlLang));
  }

  dismissNotification(notification) {
    // حفظ وقت الإغلاق
    localStorage.setItem(this.storageKey, Date.now().toString());

    // إضافة كلاس الإخفاء
    notification.classList.remove('show');
    notification.classList.add('hide');

    // إزالة العنصر من DOM
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, this.hideDelay);
  }

  handleNotificationClick() {
    // يمكن تخصيص هذه الدالة لتنفيذ إجراء معين عند النقر على الإشعار
    // مثال: فتح صفحة العروض
    // window.open('/offers', '_blank');
  }

  // دالة لإنشاء إشعار مخصص
  static createCustomNotification(options = {}) {
    const {
      message = 'رسالة افتراضية',
      type = 'info', // success, warning, error, info
      duration = 5000,
      persistent = false
    } = options;

    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');

    const isRTL = document.dir === 'rtl' || document.documentElement.dir === 'rtl';
    if (isRTL) {
      notification.setAttribute('dir', 'rtl');
    }

    const icons = {
      success: '✓',
      warning: '⚠',
      error: '✕',
      info: 'ℹ'
    };

    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">
          <span>${icons[type] || 'ℹ'}</span>
        </div>
        <p class="notification-text">${message}</p>
      </div>
      <button class="notification-close" aria-label="إغلاق" title="إغلاق">
        ×
      </button>
    `;

    document.body.appendChild(notification);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.classList.add('hide');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    });

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    if (!persistent && duration > 0) {
      setTimeout(() => {
        if (notification.parentNode) {
          notification.classList.add('hide');
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 300);
        }
      }, duration);
    }

    return notification;
  }

  // دالة لإعادة تعيين حالة الإغلاق (للاختبار)
  static resetDismissState() {
    localStorage.removeItem('notification_dismissed');
  }

  // دالة للتحقق من دعم localStorage
  static isLocalStorageSupported() {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
}

// تهيئة النظام عند تحميل الصفحة
if (NotificationSystem.isLocalStorageSupported()) {
  new NotificationSystem();
} else {
  // localStorage غير مدعوم، سيتم تشغيل الإشعارات بدون حفظ الحالة
  // يمكن تشغيل نسخة مبسطة بدون localStorage
}

// تصدير الكلاس للاستخدام العام
window.NotificationSystem = NotificationSystem;

