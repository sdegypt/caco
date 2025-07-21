/**
 * دعم التنقل الكامل باستخدام لوحة المفاتيح
 * 
 * هذا الملف يضيف دعم التنقل باستخدام لوحة المفاتيح لجميع العناصر التفاعلية
 * ويحسن إمكانية الوصول وفقاً لمعايير WCAG 2.1
 */

document.addEventListener('DOMContentLoaded', function() {
  // تحسين التركيز المرئي لجميع العناصر القابلة للتنقل
  enhanceFocusVisibility();
  
  // إضافة دعم مفاتيح التنقل للقوائم
  setupKeyboardNavigation();
  
  // إضافة اختصارات لوحة المفاتيح للوظائف الشائعة
  setupKeyboardShortcuts();
  
  // إضافة دعم التنقل بين علامات التبويب
  setupTabNavigation();
  
  // إضافة دعم التنقل للمحتوى المخفي
  setupModalKeyboardSupport();
});

/**
 * تحسين التركيز المرئي لجميع العناصر القابلة للتنقل
 */
function enhanceFocusVisibility() {
  // إضافة نمط CSS للتركيز
  const style = document.createElement('style');
  style.textContent = `
    :focus {
      outline: 3px solid #6B48FF !important;
      outline-offset: 2px !important;
      box-shadow: 0 0 0 3px rgba(107, 72, 255, 0.4) !important;
      border-radius: 3px !important;
      transition: outline 0.2s ease-in-out !important;
    }
    
    /* تحسين التركيز للأزرار */
    button:focus, a:focus, input:focus, textarea:focus, select:focus {
      outline: 3px solid #6B48FF !important;
      outline-offset: 2px !important;
    }
    
    /* إضافة تأثير عند التركيز على العناصر التفاعلية */
    .feature-card:focus-within {
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(107, 72, 255, 0.3) !important;
    }
  `;
  document.head.appendChild(style);
  
  // التأكد من أن جميع العناصر التفاعلية قابلة للتنقل باستخدام لوحة المفاتيح
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"], [tabindex]');
  interactiveElements.forEach(element => {
    // التأكد من أن العنصر قابل للتنقل
    if (element.getAttribute('tabindex') === '-1' && !element.disabled && !element.hasAttribute('aria-hidden')) {
      element.setAttribute('tabindex', '0');
    }
    
    // إضافة تأثير عند التركيز
    element.addEventListener('focus', function() {
      this.classList.add('keyboard-focus');
    });
    
    element.addEventListener('blur', function() {
      this.classList.remove('keyboard-focus');
    });
  });
}

/**
 * إعداد التنقل باستخدام لوحة المفاتيح للقوائم
 */
function setupKeyboardNavigation() {
  // التنقل في القوائم
  const navMenus = document.querySelectorAll('nav ul, .dropdown-menu, .menu');
  
  navMenus.forEach(menu => {
    const menuItems = menu.querySelectorAll('li, a, button');
    
    menuItems.forEach((item, index) => {
      // إضافة دعم مفاتيح الأسهم
      item.addEventListener('keydown', function(e) {
        switch (e.key) {
          case 'ArrowRight':
            // في واجهة عربية، السهم الأيمن يعني الانتقال للعنصر السابق
            if (index > 0) {
              e.preventDefault();
              menuItems[index - 1].focus();
            }
            break;
          case 'ArrowLeft':
            // في واجهة عربية، السهم الأيسر يعني الانتقال للعنصر التالي
            if (index < menuItems.length - 1) {
              e.preventDefault();
              menuItems[index + 1].focus();
            }
            break;
          case 'ArrowDown':
            // الانتقال للعنصر التالي
            if (index < menuItems.length - 1) {
              e.preventDefault();
              menuItems[index + 1].focus();
            }
            break;
          case 'ArrowUp':
            // الانتقال للعنصر السابق
            if (index > 0) {
              e.preventDefault();
              menuItems[index - 1].focus();
            }
            break;
          case 'Home':
            // الانتقال للعنصر الأول
            e.preventDefault();
            menuItems[0].focus();
            break;
          case 'End':
            // الانتقال للعنصر الأخير
            e.preventDefault();
            menuItems[menuItems.length - 1].focus();
            break;
        }
      });
    });
  });
}

/**
 * إعداد اختصارات لوحة المفاتيح للوظائف الشائعة
 */
function setupKeyboardShortcuts() {
  // إضافة اختصارات لوحة المفاتيح
  document.addEventListener('keydown', function(e) {
    // Alt + 1: الانتقال للصفحة الرئيسية
    if (e.altKey && e.key === '1') {
      e.preventDefault();
      window.location.href = '/';
    }
    
    // Alt + 2: الانتقال للمنتدى
    if (e.altKey && e.key === '2') {
      e.preventDefault();
      window.location.href = '/forum';
    }
    
    // Alt + 3: الانتقال للمشاريع
    if (e.altKey && e.key === '3') {
      e.preventDefault();
      window.location.href = '/projects';
    }
    
    // Alt + 4: الانتقال للوظائف
    if (e.altKey && e.key === '4') {
      e.preventDefault();
      window.location.href = '/jobs';
    }
    
    // Alt + 5: الانتقال للملف الشخصي
    if (e.altKey && e.key === '5') {
      e.preventDefault();
      window.location.href = '/profile';
    }
    
    // Alt + /: فتح مربع البحث
    if (e.altKey && e.key === '/') {
      e.preventDefault();
      const searchInput = document.querySelector('input[type="search"], .search-input');
      if (searchInput) {
        searchInput.focus();
      }
    }
    
    // Escape: إغلاق النوافذ المنبثقة
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.modal.show, .story-view.show, .dropdown.show');
      if (modals.length > 0) {
        e.preventDefault();
        modals.forEach(modal => {
          // البحث عن زر الإغلاق وتنفيذه
          const closeButton = modal.querySelector('.close, .close-btn, [data-dismiss="modal"]');
          if (closeButton) {
            closeButton.click();
          } else {
            // إخفاء النافذة إذا لم يوجد زر إغلاق
            modal.classList.remove('show');
          }
        });
      }
    }
  });
  
  // إضافة تلميحات للاختصارات
  const shortcutsInfo = document.createElement('div');
  shortcutsInfo.setAttribute('role', 'region');
  shortcutsInfo.setAttribute('aria-label', 'اختصارات لوحة المفاتيح');
  shortcutsInfo.classList.add('keyboard-shortcuts-info');
  shortcutsInfo.innerHTML = `
    <button aria-expanded="false" class="keyboard-shortcuts-toggle" aria-label="إظهار اختصارات لوحة المفاتيح">
      <i class="fas fa-keyboard"></i>
    </button>
    <div class="keyboard-shortcuts-panel" hidden>
      <h3>اختصارات لوحة المفاتيح</h3>
      <ul>
        <li><kbd>Alt</kbd> + <kbd>1</kbd>: الصفحة الرئيسية</li>
        <li><kbd>Alt</kbd> + <kbd>2</kbd>: المنتدى</li>
        <li><kbd>Alt</kbd> + <kbd>3</kbd>: المشاريع</li>
        <li><kbd>Alt</kbd> + <kbd>4</kbd>: الوظائف</li>
        <li><kbd>Alt</kbd> + <kbd>5</kbd>: الملف الشخصي</li>
        <li><kbd>Alt</kbd> + <kbd>/</kbd>: البحث</li>
        <li><kbd>Escape</kbd>: إغلاق النوافذ المنبثقة</li>
        <li><kbd>Tab</kbd>: التنقل بين العناصر</li>
        <li><kbd>Enter</kbd> أو <kbd>Space</kbd>: تنشيط العنصر</li>
      </ul>
    </div>
  `;
  
  // إضافة التلميحات للصفحة
  document.body.appendChild(shortcutsInfo);
  
  // تفعيل زر إظهار/إخفاء التلميحات
  const toggleButton = shortcutsInfo.querySelector('.keyboard-shortcuts-toggle');
  const panel = shortcutsInfo.querySelector('.keyboard-shortcuts-panel');
  
  toggleButton.addEventListener('click', function() {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !expanded);
    panel.hidden = expanded;
  });
}

/**
 * إعداد التنقل بين علامات التبويب
 */
function setupTabNavigation() {
  // البحث عن علامات التبويب
  const tabLists = document.querySelectorAll('[role="tablist"]');
  
  tabLists.forEach(tabList => {
    const tabs = tabList.querySelectorAll('[role="tab"]');
    
    tabs.forEach((tab, index) => {
      // إضافة دعم مفاتيح الأسهم
      tab.addEventListener('keydown', function(e) {
        switch (e.key) {
          case 'ArrowRight':
            // في واجهة عربية، السهم الأيمن يعني الانتقال للعلامة السابقة
            e.preventDefault();
            if (index > 0) {
              tabs[index - 1].focus();
              tabs[index - 1].click();
            } else {
              tabs[tabs.length - 1].focus();
              tabs[tabs.length - 1].click();
            }
            break;
          case 'ArrowLeft':
            // في واجهة عربية، السهم الأيسر يعني الانتقال للعلامة التالية
            e.preventDefault();
            if (index < tabs.length - 1) {
              tabs[index + 1].focus();
              tabs[index + 1].click();
            } else {
              tabs[0].focus();
              tabs[0].click();
            }
            break;
          case 'Home':
            // الانتقال للعلامة الأولى
            e.preventDefault();
            tabs[0].focus();
            tabs[0].click();
            break;
          case 'End':
            // الانتقال للعلامة الأخيرة
            e.preventDefault();
            tabs[tabs.length - 1].focus();
            tabs[tabs.length - 1].click();
            break;
        }
      });
    });
  });
}

/**
 * إعداد دعم التنقل للنوافذ المنبثقة
 */
function setupModalKeyboardSupport() {
  // البحث عن النوافذ المنبثقة
  const modals = document.querySelectorAll('.modal, .story-view, [role="dialog"]');
  
  modals.forEach(modal => {
    // حفظ العنصر الذي كان مركزاً قبل فتح النافذة
    let previousFocus = null;
    
    // عند فتح النافذة
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          if (modal.classList.contains('show')) {
            // حفظ العنصر المركز الحالي
            previousFocus = document.activeElement;
            
            // التركيز على أول عنصر قابل للتنقل في النافذة
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
              firstFocusable.focus();
            }
            
            // حصر التنقل داخل النافذة
            trapFocus(modal);
          } else if (previousFocus) {
            // إعادة التركيز للعنصر السابق عند إغلاق النافذة
            previousFocus.focus();
          }
        }
      });
    });
    
    observer.observe(modal, { attributes: true });
  });
}

/**
 * حصر التنقل داخل عنصر محدد
 * @param {HTMLElement} element - العنصر الذي سيتم حصر التنقل داخله
 */
function trapFocus(element) {
  // الحصول على جميع العناصر القابلة للتنقل داخل العنصر
  const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  
  if (focusableElements.length === 0) return;
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  // إضافة مستمع للتنقل
  element.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      // عند الضغط على Tab + Shift والتركيز على أول عنصر
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
      // عند الضغط على Tab والتركيز على آخر عنصر
      else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });
}
