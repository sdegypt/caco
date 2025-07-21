/* ===== تحسين تحميل الصفحات ===== */
document.addEventListener('DOMContentLoaded', function() {
  // تطبيق التحميل المتأخر للصور
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  // إضافة معالج الأحداث للصور المتأخرة
  lazyImages.forEach(img => {
    img.addEventListener('load', function() {
      this.classList.add('loaded');
      
      // إزالة الفئة placeholder إذا كانت موجودة
      const parent = this.parentElement;
      if (parent && parent.classList.contains('image-placeholder')) {
        parent.classList.remove('image-placeholder');
      }
    });
  });
  
  // تحسين تحميل الخلفيات
  const lazyBackgrounds = document.querySelectorAll('.lazy-background');
  
  if ('IntersectionObserver' in window) {
    const backgroundObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const bgUrl = target.dataset.background;
          
          if (bgUrl) {
            target.style.backgroundImage = `url(${bgUrl})`;
            target.classList.remove('lazy-background');
            target.classList.add('progressive-background');
            
            // إزالة من المراقبة بعد التحميل
            observer.unobserve(target);
            
            // إزالة فئة التحميل بعد فترة قصيرة
            setTimeout(() => {
              target.classList.remove('loading');
            }, 500);
          }
        }
      });
    });
    
    lazyBackgrounds.forEach(bg => {
      backgroundObserver.observe(bg);
    });
  }
  
  // تحسين تحميل المحتوى الديناميكي
  const dynamicContents = document.querySelectorAll('.dynamic-content.loading');
  
  if (dynamicContents.length > 0) {
    setTimeout(() => {
      dynamicContents.forEach(content => {
        content.classList.remove('loading');
      });
    }, 1000);
  }
  
  // تحسين تفاعلات المستخدم
  const clickableElements = document.querySelectorAll('.clickable');
  
  clickableElements.forEach(element => {
    element.addEventListener('click', function(e) {
      // إضافة تأثير النقر
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      element.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // تحسين الإشعارات
  const notifications = document.querySelectorAll('.notification');
  
  notifications.forEach(notification => {
    const closeButton = notification.querySelector('.notification-close');
    
    if (closeButton) {
      closeButton.addEventListener('click', function() {
        notification.style.animation = 'slide-out-right 0.5s ease forwards';
        
        setTimeout(() => {
          notification.remove();
        }, 500);
      });
    }
    
    // إخفاء الإشعارات تلقائياً بعد فترة
    setTimeout(() => {
      notification.style.animation = 'slide-out-right 0.5s ease forwards';
      
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 5000);
  });
  
  // تحسين النماذج العائمة
  const floatingInputs = document.querySelectorAll('.form-floating input, .form-floating textarea');
  
  floatingInputs.forEach(input => {
    // التحقق من الحالة الأولية
    if (input.value.trim() !== '') {
      input.classList.add('has-value');
    }
    
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
      
      if (this.value.trim() !== '') {
        this.classList.add('has-value');
      } else {
        this.classList.remove('has-value');
      }
    });
  });
  
  // تحسين التنقل على الأجهزة المحمولة
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      const targetMenu = document.querySelector(this.dataset.target);
      
      if (targetMenu) {
        targetMenu.classList.toggle('active');
        this.classList.toggle('active');
        
        // تبديل حالة aria-expanded
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
      }
    });
  }
  
  // تحسين إمكانية الوصول
  const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  
  focusableElements.forEach(element => {
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      const text = element.textContent.trim();
      
      if (text) {
        element.setAttribute('aria-label', text);
      }
    }
  });
});

// تحسين تحميل الصفحة
window.addEventListener('load', function() {
  document.body.classList.add('page-loaded');
  
  // إزالة فئات التحميل
  const loadingElements = document.querySelectorAll('.loading');
  
  loadingElements.forEach(element => {
    element.classList.remove('loading');
  });
});
