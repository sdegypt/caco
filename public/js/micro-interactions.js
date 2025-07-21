/**
 * تأثيرات Micro-interactions للعناصر التفاعلية
 * 
 * هذا الملف يضيف تأثيرات تفاعلية صغيرة للعناصر المختلفة
 * لتحسين تجربة المستخدم وجعل الواجهة أكثر حيوية
 */

document.addEventListener('DOMContentLoaded', function() {
  // إضافة تأثيرات للأزرار
  addButtonEffects();
  
  // إضافة تأثيرات للروابط
  addLinkEffects();
  
  // إضافة تأثيرات للنماذج
  addFormEffects();
  
  // إضافة تأثيرات للبطاقات
  addCardEffects();
  
  // إضافة تأثيرات للقوائم المنسدلة
  addDropdownEffects();
  
  // إضافة تأثيرات للإشعارات
  addNotificationEffects();
  
  // إضافة تأثيرات للتمرير
  addScrollEffects();
});

/**
 * إضافة تأثيرات للأزرار
 */
function addButtonEffects() {
  const buttons = document.querySelectorAll('button, .btn, [role="button"]');
  
  buttons.forEach(button => {
    // تأثير النبض عند النقر
    button.addEventListener('click', function(e) {
      // إنشاء عنصر دائري للتأثير
      const circle = document.createElement('span');
      circle.classList.add('pulse-effect');
      
      // تحديد موقع النقر
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // تعيين موقع التأثير
      circle.style.top = y + 'px';
      circle.style.left = x + 'px';
      
      // إضافة التأثير للزر
      this.appendChild(circle);
      
      // إزالة التأثير بعد انتهاء الرسوم المتحركة
      setTimeout(() => {
        circle.remove();
      }, 700);
    });
    
    // تأثير التحويم
    button.addEventListener('mouseenter', function() {
      this.classList.add('hover-effect');
    });
    
    button.addEventListener('mouseleave', function() {
      this.classList.remove('hover-effect');
    });
    
    // تأثير التركيز
    button.addEventListener('focus', function() {
      this.classList.add('focus-effect');
    });
    
    button.addEventListener('blur', function() {
      this.classList.remove('focus-effect');
    });
  });
}

/**
 * إضافة تأثيرات للروابط
 */
function addLinkEffects() {
  const links = document.querySelectorAll('a:not(.btn):not([role="button"])');
  
  links.forEach(link => {
    // تأثير التحويم
    link.addEventListener('mouseenter', function() {
      this.classList.add('link-hover-effect');
    });
    
    link.addEventListener('mouseleave', function() {
      this.classList.remove('link-hover-effect');
    });
    
    // تأثير النقر
    link.addEventListener('click', function() {
      this.classList.add('link-click-effect');
      
      setTimeout(() => {
        this.classList.remove('link-click-effect');
      }, 300);
    });
  });
}

/**
 * إضافة تأثيرات للنماذج
 */
function addFormEffects() {
  // تأثيرات حقول الإدخال
  const inputs = document.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]), textarea, select');
  
  inputs.forEach(input => {
    // تأثير التركيز
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('input-focus-effect');
      
      // تحريك التسمية للأعلى إذا كانت موجودة
      const label = this.parentElement.querySelector('label');
      if (label) {
        label.classList.add('label-float-effect');
      }
    });
    
    input.addEventListener('blur', function() {
      // الاحتفاظ بالتسمية في الأعلى إذا كان الحقل يحتوي على قيمة
      if (!this.value) {
        this.parentElement.classList.remove('input-focus-effect');
        
        const label = this.parentElement.querySelector('label');
        if (label) {
          label.classList.remove('label-float-effect');
        }
      }
    });
    
    // تأثير الكتابة
    input.addEventListener('input', function() {
      if (this.value) {
        this.classList.add('input-has-value');
      } else {
        this.classList.remove('input-has-value');
      }
    });
  });
  
  // تأثيرات مربعات الاختيار
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        this.classList.add('checkbox-checked-effect');
      } else {
        this.classList.remove('checkbox-checked-effect');
      }
    });
  });
  
  // تأثيرات أزرار الراديو
  const radios = document.querySelectorAll('input[type="radio"]');
  
  radios.forEach(radio => {
    radio.addEventListener('change', function() {
      // إزالة التأثير من جميع الأزرار في نفس المجموعة
      const name = this.getAttribute('name');
      document.querySelectorAll(`input[type="radio"][name="${name}"]`).forEach(r => {
        r.classList.remove('radio-checked-effect');
      });
      
      // إضافة التأثير للزر المحدد
      this.classList.add('radio-checked-effect');
    });
  });
}

/**
 * إضافة تأثيرات للبطاقات
 */
function addCardEffects() {
  const cards = document.querySelectorAll('.card, .feature-card, .dashboard-card');
  
  cards.forEach(card => {
    // تأثير التحويم
    card.addEventListener('mouseenter', function() {
      this.classList.add('card-hover-effect');
    });
    
    card.addEventListener('mouseleave', function() {
      this.classList.remove('card-hover-effect');
    });
    
    // تأثير النقر
    card.addEventListener('click', function() {
      this.classList.add('card-click-effect');
      
      setTimeout(() => {
        this.classList.remove('card-click-effect');
      }, 300);
    });
  });
}

/**
 * إضافة تأثيرات للقوائم المنسدلة
 */
function addDropdownEffects() {
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle, [data-toggle="dropdown"]');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const dropdown = this.nextElementSibling || document.querySelector(this.getAttribute('data-target'));
      
      if (dropdown) {
        if (dropdown.classList.contains('show')) {
          // تأثير الإغلاق
          dropdown.classList.add('dropdown-closing');
          
          setTimeout(() => {
            dropdown.classList.remove('show');
            dropdown.classList.remove('dropdown-closing');
          }, 300);
        } else {
          // تأثير الفتح
          dropdown.classList.add('show');
          dropdown.classList.add('dropdown-opening');
          
          setTimeout(() => {
            dropdown.classList.remove('dropdown-opening');
          }, 300);
        }
      }
    });
  });
}

/**
 * إضافة تأثيرات للإشعارات
 */
function addNotificationEffects() {
  // تحسين الإشعارات الموجودة
  const notifications = document.querySelectorAll('.notification, .alert, .toast');
  
  notifications.forEach(notification => {
    // إضافة زر إغلاق إذا لم يكن موجوداً
    if (!notification.querySelector('.close, .close-btn')) {
      const closeButton = document.createElement('button');
      closeButton.classList.add('close-btn');
      closeButton.innerHTML = '&times;';
      closeButton.setAttribute('aria-label', 'إغلاق');
      
      closeButton.addEventListener('click', function() {
        dismissNotification(notification);
      });
      
      notification.appendChild(closeButton);
    }
    
    // إضافة تأثير الظهور
    notification.classList.add('notification-show-effect');
    
    // إغلاق تلقائي بعد فترة
    if (notification.classList.contains('auto-dismiss')) {
      setTimeout(() => {
        dismissNotification(notification);
      }, 5000);
    }
  });
  
  // إنشاء وظيفة لإظهار إشعارات جديدة
  window.showNotification = function(message, type = 'info', autoDismiss = true) {
    // إنشاء الإشعار
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`, 'notification-new');
    
    // إضافة أيقونة حسب النوع
    let icon = '';
    switch (type) {
      case 'success':
        icon = '<i class="fas fa-check-circle"></i>';
        break;
      case 'error':
        icon = '<i class="fas fa-exclamation-circle"></i>';
        break;
      case 'warning':
        icon = '<i class="fas fa-exclamation-triangle"></i>';
        break;
      default:
        icon = '<i class="fas fa-info-circle"></i>';
    }
    
    // إضافة المحتوى
    notification.innerHTML = `
      ${icon}
      <div class="notification-content">${message}</div>
      <button class="close-btn" aria-label="إغلاق">&times;</button>
    `;
    
    // إضافة الإشعار للصفحة
    const container = document.querySelector('.notifications-container');
    if (container) {
      container.appendChild(notification);
    } else {
      // إنشاء حاوية إذا لم تكن موجودة
      const newContainer = document.createElement('div');
      newContainer.classList.add('notifications-container');
      newContainer.appendChild(notification);
      document.body.appendChild(newContainer);
    }
    
    // إضافة تأثير الظهور
    setTimeout(() => {
      notification.classList.add('notification-show-effect');
    }, 10);
    
    // إضافة مستمع لزر الإغلاق
    notification.querySelector('.close-btn').addEventListener('click', function() {
      dismissNotification(notification);
    });
    
    // إغلاق تلقائي
    if (autoDismiss) {
      setTimeout(() => {
        dismissNotification(notification);
      }, 5000);
    }
    
    return notification;
  };
}

/**
 * إغلاق الإشعار مع تأثير
 * @param {HTMLElement} notification - عنصر الإشعار
 */
function dismissNotification(notification) {
  notification.classList.add('notification-hide-effect');
  
  setTimeout(() => {
    notification.remove();
  }, 300);
}

/**
 * إضافة تأثيرات للتمرير
 */
function addScrollEffects() {
  // تأثير ظهور العناصر عند التمرير
  const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
  
  // إنشاء مراقب التمرير
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scrolled-into-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  // مراقبة العناصر
  elementsToAnimate.forEach(element => {
    observer.observe(element);
  });
  
  // إضافة زر التمرير للأعلى
  const scrollTopButton = document.createElement('button');
  scrollTopButton.classList.add('scroll-top-button');
  scrollTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollTopButton.setAttribute('aria-label', 'التمرير للأعلى');
  document.body.appendChild(scrollTopButton);
  
  // إظهار/إخفاء زر التمرير للأعلى
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      scrollTopButton.classList.add('show');
    } else {
      scrollTopButton.classList.remove('show');
    }
  });
  
  // التمرير للأعلى عند النقر
  scrollTopButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
