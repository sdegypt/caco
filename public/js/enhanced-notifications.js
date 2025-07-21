/**
 * تحسين الإشعارات والتنبيهات
 * 
 * هذا الملف يحسن الإشعارات والتنبيهات لتكون أكثر تفاعلية وإفادة
 */

document.addEventListener('DOMContentLoaded', function() {
  // إنشاء حاوية للإشعارات إذا لم تكن موجودة
  createNotificationsContainer();
  
  // تحسين الإشعارات الموجودة
  enhanceExistingNotifications();
  
  // إضافة وظائف الإشعارات العامة
  setupNotificationSystem();
});

/**
 * إنشاء حاوية للإشعارات
 */
function createNotificationsContainer() {
  if (!document.querySelector('.notifications-container')) {
    const container = document.createElement('div');
    container.className = 'notifications-container';
    document.body.appendChild(container);
  }
}

/**
 * تحسين الإشعارات الموجودة
 */
function enhanceExistingNotifications() {
  const notifications = document.querySelectorAll('.alert, .notification, .toast');
  
  notifications.forEach(notification => {
    // إضافة زر إغلاق إذا لم يكن موجوداً
    if (!notification.querySelector('.close, .close-btn, [data-dismiss]')) {
      const closeButton = document.createElement('button');
      closeButton.className = 'notification-close';
      closeButton.innerHTML = '&times;';
      closeButton.setAttribute('aria-label', 'إغلاق');
      closeButton.setAttribute('type', 'button');
      
      closeButton.addEventListener('click', function() {
        dismissNotification(notification);
      });
      
      notification.appendChild(closeButton);
    }
    
    // إضافة أيقونة مناسبة إذا لم تكن موجودة
    if (!notification.querySelector('i, .icon, .fa, .fas')) {
      const icon = document.createElement('i');
      
      if (notification.classList.contains('alert-success') || notification.classList.contains('success')) {
        icon.className = 'fas fa-check-circle notification-icon';
      } else if (notification.classList.contains('alert-danger') || notification.classList.contains('error')) {
        icon.className = 'fas fa-exclamation-circle notification-icon';
      } else if (notification.classList.contains('alert-warning') || notification.classList.contains('warning')) {
        icon.className = 'fas fa-exclamation-triangle notification-icon';
      } else {
        icon.className = 'fas fa-info-circle notification-icon';
      }
      
      notification.prepend(icon);
    }
    
    // إضافة خصائص ARIA
    if (!notification.hasAttribute('role')) {
      notification.setAttribute('role', 'alert');
    }
    
    if (!notification.hasAttribute('aria-live')) {
      notification.setAttribute('aria-live', 'polite');
    }
  });
}

/**
 * إعداد نظام الإشعارات
 */
function setupNotificationSystem() {
  // إضافة وظيفة عامة لإظهار الإشعارات
  window.showNotification = function(options) {
    // الخيارات الافتراضية
    const defaults = {
      message: '',
      type: 'info',
      title: '',
      icon: true,
      closeButton: true,
      autoClose: true,
      duration: 5000,
      position: 'top-left',
      animationIn: 'fadeInLeft',
      animationOut: 'fadeOutLeft',
      onClose: null,
      onClick: null
    };
    
    // دمج الخيارات المقدمة مع الافتراضية
    const settings = Object.assign({}, defaults, typeof options === 'string' ? { message: options } : options);
    
    // إنشاء الإشعار
    const notification = document.createElement('div');
    notification.className = `notification notification-${settings.type} ${settings.animationIn}`;
    
    // تحديد الأيقونة المناسبة
    let iconClass = '';
    switch (settings.type) {
      case 'success':
        iconClass = 'fas fa-check-circle';
        break;
      case 'error':
        iconClass = 'fas fa-exclamation-circle';
        break;
      case 'warning':
        iconClass = 'fas fa-exclamation-triangle';
        break;
      default:
        iconClass = 'fas fa-info-circle';
    }
    
    // إنشاء محتوى الإشعار
    let notificationContent = '';
    
    // إضافة الأيقونة إذا كانت مطلوبة
    if (settings.icon) {
      notificationContent += `<i class="${iconClass} notification-icon"></i>`;
    }
    
    // إضافة المحتوى
    notificationContent += '<div class="notification-content">';
    
    // إضافة العنوان إذا كان موجوداً
    if (settings.title) {
      notificationContent += `<h4 class="notification-title">${settings.title}</h4>`;
    }
    
    // إضافة الرسالة
    notificationContent += `<div class="notification-message">${settings.message}</div>`;
    notificationContent += '</div>';
    
    // إضافة زر الإغلاق إذا كان مطلوباً
    if (settings.closeButton) {
      notificationContent += '<button type="button" class="notification-close" aria-label="إغلاق">&times;</button>';
    }
    
    // إضافة المحتوى للإشعار
    notification.innerHTML = notificationContent;
    
    // إضافة خصائص ARIA
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    // إضافة الإشعار للحاوية
    const container = document.querySelector('.notifications-container');
    container.appendChild(notification);
    
    // إضافة مستمع لزر الإغلاق
    const closeButton = notification.querySelector('.notification-close');
    if (closeButton) {
      closeButton.addEventListener('click', function() {
        dismissNotification(notification, settings.animationOut, settings.onClose);
      });
    }
    
    // إضافة مستمع للنقر على الإشعار
    if (typeof settings.onClick === 'function') {
      notification.addEventListener('click', function(e) {
        // تجاهل النقر على زر الإغلاق
        if (!e.target.classList.contains('notification-close')) {
          settings.onClick.call(this, e);
        }
      });
      
      // إضافة مؤشر للإشارة إلى أن الإشعار قابل للنقر
      notification.classList.add('notification-clickable');
    }
    
    // إغلاق تلقائي بعد فترة محددة
    if (settings.autoClose) {
      setTimeout(function() {
        // التحقق من أن الإشعار لا يزال موجوداً
        if (notification.parentNode) {
          dismissNotification(notification, settings.animationOut, settings.onClose);
        }
      }, settings.duration);
    }
    
    // إعادة الإشعار للاستخدام اللاحق
    return notification;
  };
  
  // إضافة وظائف مختصرة للإشعارات
  window.showSuccessNotification = function(message, options) {
    return window.showNotification(Object.assign({}, { message, type: 'success' }, options));
  };
  
  window.showErrorNotification = function(message, options) {
    return window.showNotification(Object.assign({}, { message, type: 'error' }, options));
  };
  
  window.showWarningNotification = function(message, options) {
    return window.showNotification(Object.assign({}, { message, type: 'warning' }, options));
  };
  
  window.showInfoNotification = function(message, options) {
    return window.showNotification(Object.assign({}, { message, type: 'info' }, options));
  };
}

/**
 * إغلاق الإشعار مع تأثير
 * @param {HTMLElement} notification - عنصر الإشعار
 * @param {string} animationOut - فئة CSS للرسوم المتحركة عند الإغلاق
 * @param {Function} callback - دالة يتم استدعاؤها بعد إغلاق الإشعار
 */
function dismissNotification(notification, animationOut = 'fadeOut', callback = null) {
  // إضافة فئة الرسوم المتحركة للإغلاق
  notification.classList.add(animationOut);
  
  // إزالة الإشعار بعد انتهاء الرسوم المتحركة
  setTimeout(function() {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
      
      // استدعاء دالة رد الاتصال إذا كانت موجودة
      if (typeof callback === 'function') {
        callback();
      }
    }
  }, 300);
}

/**
 * إضافة أنماط CSS للإشعارات
 */
function addNotificationStyles() {
  // إنشاء عنصر style
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* حاوية الإشعارات */
    .notifications-container {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 350px;
      width: calc(100% - 40px);
    }
    
    /* الإشعار */
    .notification {
      display: flex;
      align-items: flex-start;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background-color: #fff;
      border-right: 4px solid #6B48FF;
      margin-bottom: 10px;
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateX(-20px);
      animation-duration: 0.3s;
      animation-fill-mode: forwards;
    }
    
    /* أنواع الإشعارات */
    .notification-info {
      border-right-color: #0277BD;
    }
    
    .notification-success {
      border-right-color: #2E7D32;
    }
    
    .notification-warning {
      border-right-color: #AF6C00;
    }
    
    .notification-error {
      border-right-color: #D32F2F;
    }
    
    /* أيقونة الإشعار */
    .notification-icon {
      margin-left: 15px;
      font-size: 1.5rem;
      flex-shrink: 0;
    }
    
    .notification-info .notification-icon {
      color: #0277BD;
    }
    
    .notification-success .notification-icon {
      color: #2E7D32;
    }
    
    .notification-warning .notification-icon {
      color: #AF6C00;
    }
    
    .notification-error .notification-icon {
      color: #D32F2F;
    }
    
    /* محتوى الإشعار */
    .notification-content {
      flex-grow: 1;
    }
    
    /* عنوان الإشعار */
    .notification-title {
      margin: 0 0 5px 0;
      font-size: 1rem;
      font-weight: bold;
    }
    
    /* رسالة الإشعار */
    .notification-message {
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    
    /* زر إغلاق الإشعار */
    .notification-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      line-height: 1;
      padding: 0;
      margin-right: 10px;
      cursor: pointer;
      color: #666;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }
    
    .notification-close:hover {
      opacity: 1;
    }
    
    /* إشعار قابل للنقر */
    .notification-clickable {
      cursor: pointer;
    }
    
    .notification-clickable:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
    
    /* رسوم متحركة للظهور */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* رسوم متحركة للإغلاق */
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    @keyframes fadeOutLeft {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(-20px);
      }
    }
    
    @keyframes fadeOutRight {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(20px);
      }
    }
    
    @keyframes fadeOutUp {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-20px);
      }
    }
    
    @keyframes fadeOutDown {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(20px);
      }
    }
    
    /* تطبيق الرسوم المتحركة */
    .fadeIn { animation-name: fadeIn; }
    .fadeInLeft { animation-name: fadeInLeft; }
    .fadeInRight { animation-name: fadeInRight; }
    .fadeInUp { animation-name: fadeInUp; }
    .fadeInDown { animation-name: fadeInDown; }
    
    .fadeOut { animation-name: fadeOut; }
    .fadeOutLeft { animation-name: fadeOutLeft; }
    .fadeOutRight { animation-name: fadeOutRight; }
    .fadeOutUp { animation-name: fadeOutUp; }
    .fadeOutDown { animation-name: fadeOutDown; }
  `;
  
  // إضافة الأنماط إلى الصفحة
  document.head.appendChild(styleElement);
}

// إضافة أنماط الإشعارات
addNotificationStyles();
