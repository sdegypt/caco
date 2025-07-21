/**
 * إضافة خصائص ARIA للعناصر التفاعلية
 * 
 * هذا الملف يضيف خصائص ARIA للعناصر التفاعلية في جميع القوالب
 * لتحسين إمكانية الوصول وفقاً لمعايير WCAG 2.1
 */

document.addEventListener('DOMContentLoaded', function() {
  // إضافة ARIA landmarks للعناصر الرئيسية
  addAriaLandmarks();
  
  // إضافة ARIA labels للعناصر التفاعلية
  addAriaLabels();
  
  // إضافة ARIA roles للعناصر التفاعلية
  addAriaRoles();
  
  // إضافة ARIA states للعناصر التفاعلية
  addAriaStates();
  
  // إضافة ARIA properties للعناصر التفاعلية
  addAriaProperties();
  
  // إضافة ARIA live regions للإشعارات
  addAriaLiveRegions();
});

/**
 * إضافة ARIA landmarks للعناصر الرئيسية
 */
function addAriaLandmarks() {
  // إضافة role="banner" للهيدر
  const header = document.querySelector('header');
  if (header && !header.hasAttribute('role')) {
    header.setAttribute('role', 'banner');
  }
  
  // إضافة role="navigation" للقوائم
  const navs = document.querySelectorAll('nav');
  navs.forEach(nav => {
    if (!nav.hasAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
    
    // إضافة aria-label للقوائم المتعددة
    if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
      if (nav.classList.contains('main-nav')) {
        nav.setAttribute('aria-label', 'القائمة الرئيسية');
      } else if (nav.classList.contains('user-nav')) {
        nav.setAttribute('aria-label', 'قائمة المستخدم');
      } else if (nav.classList.contains('footer-nav')) {
        nav.setAttribute('aria-label', 'قائمة التذييل');
      } else {
        nav.setAttribute('aria-label', 'قائمة التنقل');
      }
    }
  });
  
  // إضافة role="main" للمحتوى الرئيسي
  const main = document.querySelector('main');
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  } else if (!document.querySelector('[role="main"]')) {
    // إذا لم يكن هناك عنصر main، نبحث عن المحتوى الرئيسي
    const content = document.querySelector('.container, .content, #content, .main-content');
    if (content && !content.hasAttribute('role')) {
      content.setAttribute('role', 'main');
    }
  }
  
  // إضافة role="contentinfo" للفوتر
  const footer = document.querySelector('footer');
  if (footer && !footer.hasAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
  
  // إضافة role="search" لنماذج البحث
  const searchForms = document.querySelectorAll('form[action*="search"], .search-form');
  searchForms.forEach(form => {
    if (!form.hasAttribute('role')) {
      form.setAttribute('role', 'search');
    }
  });
  
  // إضافة role="complementary" للمحتوى الجانبي
  const asides = document.querySelectorAll('aside, .sidebar, .widget');
  asides.forEach(aside => {
    if (!aside.hasAttribute('role')) {
      aside.setAttribute('role', 'complementary');
    }
    
    // إضافة aria-label للمحتوى الجانبي
    if (!aside.hasAttribute('aria-label') && !aside.hasAttribute('aria-labelledby')) {
      if (aside.classList.contains('right-sidebar')) {
        aside.setAttribute('aria-label', 'الشريط الجانبي الأيمن');
      } else if (aside.classList.contains('left-sidebar')) {
        aside.setAttribute('aria-label', 'الشريط الجانبي الأيسر');
      } else {
        aside.setAttribute('aria-label', 'محتوى إضافي');
      }
    }
  });
}

/**
 * إضافة ARIA labels للعناصر التفاعلية
 */
function addAriaLabels() {
  // إضافة aria-label للروابط التي تحتوي على أيقونات فقط
  const iconLinks = document.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
  iconLinks.forEach(link => {
    if (!link.textContent.trim() && link.querySelector('i, .icon, .fa, .fas, .fab, .far')) {
      // محاولة استنتاج وظيفة الرابط
      let label = '';
      
      if (link.classList.contains('search') || link.querySelector('.fa-search')) {
        label = 'بحث';
      } else if (link.classList.contains('user') || link.querySelector('.fa-user')) {
        label = 'الملف الشخصي';
      } else if (link.classList.contains('home') || link.querySelector('.fa-home')) {
        label = 'الصفحة الرئيسية';
      } else if (link.classList.contains('bell') || link.querySelector('.fa-bell')) {
        label = 'الإشعارات';
      } else if (link.classList.contains('envelope') || link.querySelector('.fa-envelope')) {
        label = 'الرسائل';
      } else if (link.classList.contains('cog') || link.querySelector('.fa-cog')) {
        label = 'الإعدادات';
      } else if (link.classList.contains('heart') || link.querySelector('.fa-heart')) {
        label = 'إعجاب';
      } else if (link.classList.contains('comment') || link.querySelector('.fa-comment')) {
        label = 'تعليق';
      } else if (link.classList.contains('share') || link.querySelector('.fa-share')) {
        label = 'مشاركة';
      } else if (link.classList.contains('trash') || link.querySelector('.fa-trash')) {
        label = 'حذف';
      } else if (link.classList.contains('edit') || link.querySelector('.fa-edit')) {
        label = 'تعديل';
      } else {
        // إذا لم نتمكن من استنتاج الوظيفة، نستخدم عنوان الرابط
        label = link.getAttribute('title') || link.getAttribute('href') || 'رابط';
      }
      
      link.setAttribute('aria-label', label);
    }
  });
  
  // إضافة aria-label للأزرار التي تحتوي على أيقونات فقط
  const iconButtons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
  iconButtons.forEach(button => {
    if (!button.textContent.trim() && button.querySelector('i, .icon, .fa, .fas, .fab, .far')) {
      // محاولة استنتاج وظيفة الزر
      let label = '';
      
      if (button.classList.contains('close') || button.querySelector('.fa-times')) {
        label = 'إغلاق';
      } else if (button.classList.contains('search') || button.querySelector('.fa-search')) {
        label = 'بحث';
      } else if (button.classList.contains('menu') || button.querySelector('.fa-bars')) {
        label = 'القائمة';
      } else if (button.classList.contains('refresh') || button.querySelector('.fa-sync')) {
        label = 'تحديث';
      } else if (button.classList.contains('like') || button.querySelector('.fa-thumbs-up')) {
        label = 'إعجاب';
      } else if (button.classList.contains('dislike') || button.querySelector('.fa-thumbs-down')) {
        label = 'عدم إعجاب';
      } else {
        // إذا لم نتمكن من استنتاج الوظيفة، نستخدم عنوان الزر
        label = button.getAttribute('title') || 'زر';
      }
      
      button.setAttribute('aria-label', label);
    }
  });
  
  // إضافة aria-label لحقول النماذج التي ليس لها تسمية
  const formFields = document.querySelectorAll('input, select, textarea');
  formFields.forEach(field => {
    // التحقق من وجود تسمية مرتبطة
    const id = field.getAttribute('id');
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (!label) {
        // إذا لم يكن هناك تسمية، نضيف aria-label
        if (!field.hasAttribute('aria-label') && !field.hasAttribute('aria-labelledby')) {
          const placeholder = field.getAttribute('placeholder');
          if (placeholder) {
            field.setAttribute('aria-label', placeholder);
          } else {
            // محاولة استنتاج وظيفة الحقل
            let label = '';
            
            if (field.name === 'search' || field.id === 'search') {
              label = 'بحث';
            } else if (field.name === 'email' || field.id === 'email') {
              label = 'البريد الإلكتروني';
            } else if (field.name === 'password' || field.id === 'password') {
              label = 'كلمة المرور';
            } else if (field.name === 'username' || field.id === 'username') {
              label = 'اسم المستخدم';
            } else if (field.name === 'name' || field.id === 'name') {
              label = 'الاسم';
            } else if (field.name === 'phone' || field.id === 'phone') {
              label = 'رقم الهاتف';
            } else if (field.name === 'address' || field.id === 'address') {
              label = 'العنوان';
            } else if (field.name === 'message' || field.id === 'message') {
              label = 'الرسالة';
            } else {
              // إذا لم نتمكن من استنتاج الوظيفة، نستخدم اسم الحقل
              label = field.name || field.id || 'حقل';
            }
            
            field.setAttribute('aria-label', label);
          }
        }
      }
    } else if (!field.hasAttribute('aria-label') && !field.hasAttribute('aria-labelledby')) {
      // إذا لم يكن هناك معرف، نضيف aria-label
      const placeholder = field.getAttribute('placeholder');
      if (placeholder) {
        field.setAttribute('aria-label', placeholder);
      } else {
        field.setAttribute('aria-label', field.name || 'حقل');
      }
    }
  });
}

/**
 * إضافة ARIA roles للعناصر التفاعلية
 */
function addAriaRoles() {
  // إضافة role="button" للعناصر التي تعمل كأزرار
  const buttonLikes = document.querySelectorAll('.btn, .button, [onclick]:not(button):not(a):not(input)');
  buttonLikes.forEach(el => {
    if (!el.hasAttribute('role')) {
      el.setAttribute('role', 'button');
      
      // التأكد من إمكانية التنقل باستخدام لوحة المفاتيح
      if (!el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '0');
      }
      
      // إضافة مستمع لمفتاح Enter و Space
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    }
  });
  
  // إضافة role="tab" و role="tabpanel" لعلامات التبويب
  const tabs = document.querySelectorAll('.tab, .nav-tab, [data-toggle="tab"]');
  tabs.forEach(tab => {
    if (!tab.hasAttribute('role')) {
      tab.setAttribute('role', 'tab');
      
      // التأكد من إمكانية التنقل باستخدام لوحة المفاتيح
      if (!tab.hasAttribute('tabindex')) {
        tab.setAttribute('tabindex', '0');
      }
      
      // إضافة aria-selected
      if (!tab.hasAttribute('aria-selected')) {
        tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
      }
      
      // البحث عن لوحة التبويب المرتبطة
      const target = tab.getAttribute('href') || tab.getAttribute('data-target');
      if (target) {
        const tabpanel = document.querySelector(target);
        if (tabpanel && !tabpanel.hasAttribute('role')) {
          tabpanel.setAttribute('role', 'tabpanel');
          
          // ربط لوحة التبويب بالعلامة
          if (!tabpanel.hasAttribute('aria-labelledby') && tab.id) {
            tabpanel.setAttribute('aria-labelledby', tab.id);
          }
        }
      }
    }
  });
  
  // إضافة role="tablist" لحاويات علامات التبويب
  const tablists = document.querySelectorAll('.nav-tabs, .tabs');
  tablists.forEach(tablist => {
    if (!tablist.hasAttribute('role')) {
      tablist.setAttribute('role', 'tablist');
    }
  });
  
  // إضافة role="alert" للإشعارات
  const alerts = document.querySelectorAll('.alert, .notification, .toast');
  alerts.forEach(alert => {
    if (!alert.hasAttribute('role')) {
      alert.setAttribute('role', 'alert');
    }
  });
  
  // إضافة role="dialog" للنوافذ المنبثقة
  const dialogs = document.querySelectorAll('.modal, .dialog, .popup');
  dialogs.forEach(dialog => {
    if (!dialog.hasAttribute('role')) {
      dialog.setAttribute('role', 'dialog');
      
      // إضافة aria-modal
      if (!dialog.hasAttribute('aria-modal')) {
        dialog.setAttribute('aria-modal', 'true');
      }
      
      // إضافة aria-labelledby
      const header = dialog.querySelector('.modal-header h5, .modal-title, .dialog-title, .popup-title');
      if (header && header.id) {
        dialog.setAttribute('aria-labelledby', header.id);
      } else if (header && !header.id) {
        const id = 'dialog-title-' + Math.random().toString(36).substring(2, 9);
        header.id = id;
        dialog.setAttribute('aria-labelledby', id);
      }
    }
  });
  
  // إضافة role="menu" للقوائم المنسدلة
  const menus = document.querySelectorAll('.dropdown-menu, .menu');
  menus.forEach(menu => {
    if (!menu.hasAttribute('role')) {
      menu.setAttribute('role', 'menu');
      
      // إضافة role="menuitem" لعناصر القائمة
      const items = menu.querySelectorAll('li > a, .dropdown-item');
      items.forEach(item => {
        if (!item.hasAttribute('role')) {
          item.setAttribute('role', 'menuitem');
        }
      });
    }
  });
}

/**
 * إضافة ARIA states للعناصر التفاعلية
 */
function addAriaStates() {
  // إضافة aria-expanded للقوائم المنسدلة
  const dropdowns = document.querySelectorAll('.dropdown-toggle, [data-toggle="dropdown"]');
  dropdowns.forEach(dropdown => {
    if (!dropdown.hasAttribute('aria-expanded')) {
      dropdown.setAttribute('aria-expanded', dropdown.classList.contains('show') ? 'true' : 'false');
      
      // إضافة مستمع لتحديث aria-expanded
      dropdown.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', (!expanded).toString());
      });
    }
  });
  
  // إضافة aria-checked للخيارات
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    if (!checkbox.hasAttribute('aria-checked')) {
      checkbox.setAttribute('aria-checked', checkbox.checked ? 'true' : 'false');
      
      // إضافة مستمع لتحديث aria-checked
      checkbox.addEventListener('change', function() {
        this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
      });
    }
  });
  
  // إضافة aria-pressed للأزرار التي تعمل كمفاتيح تبديل
  const toggleButtons = document.querySelectorAll('.toggle-button, .btn-toggle, [data-toggle="button"]');
  toggleButtons.forEach(button => {
    if (!button.hasAttribute('aria-pressed')) {
      button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
      
      // إضافة مستمع لتحديث aria-pressed
      button.addEventListener('click', function() {
        const pressed = this.getAttribute('aria-pressed') === 'true';
        this.setAttribute('aria-pressed', (!pressed).toString());
      });
    }
  });
  
  // إضافة aria-selected لعناصر القائمة المحددة
  const selectedItems = document.querySelectorAll('.nav-item.active, .selected');
  selectedItems.forEach(item => {
    if (!item.hasAttribute('aria-selected')) {
      item.setAttribute('aria-selected', 'true');
    }
  });
  
  // إضافة aria-current للصفحة الحالية
  const currentPageLinks = document.querySelectorAll('.current-page, .active[href]');
  currentPageLinks.forEach(link => {
    if (!link.hasAttribute('aria-current')) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

/**
 * إضافة ARIA properties للعناصر التفاعلية
 */
function addAriaProperties() {
  // إضافة aria-controls للعناصر التي تتحكم في عناصر أخرى
  const controllers = document.querySelectorAll('[data-target], [data-toggle][href], [data-toggle][data-target]');
  controllers.forEach(controller => {
    if (!controller.hasAttribute('aria-controls')) {
      const target = controller.getAttribute('data-target') || controller.getAttribute('href');
      if (target && target.startsWith('#')) {
        const targetId = target.substring(1);
        controller.setAttribute('aria-controls', targetId);
      }
    }
  });
  
  // إضافة aria-describedby للحقول التي لها نص وصفي
  const formFields = document.querySelectorAll('input, select, textarea');
  formFields.forEach(field => {
    const id = field.getAttribute('id');
    if (id) {
      const helpText = document.querySelector(`.form-text[data-for="${id}"], #${id}-help, #${id}-description`);
      if (helpText && !field.hasAttribute('aria-describedby')) {
        if (!helpText.id) {
          helpText.id = id + '-description';
        }
        field.setAttribute('aria-describedby', helpText.id);
      }
    }
  });
  
  // إضافة aria-required للحقول المطلوبة
  const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
  requiredFields.forEach(field => {
    if (!field.hasAttribute('aria-required')) {
      field.setAttribute('aria-required', 'true');
    }
  });
  
  // إضافة aria-invalid للحقول غير الصالحة
  const invalidFields = document.querySelectorAll('.is-invalid, .invalid');
  invalidFields.forEach(field => {
    if (!field.hasAttribute('aria-invalid')) {
      field.setAttribute('aria-invalid', 'true');
    }
  });
  
  // إضافة aria-hidden للعناصر المخفية
  const hiddenElements = document.querySelectorAll('.hidden, .d-none, [style*="display: none"]');
  hiddenElements.forEach(element => {
    if (!element.hasAttribute('aria-hidden')) {
      element.setAttribute('aria-hidden', 'true');
    }
  });
}

/**
 * إضافة ARIA live regions للإشعارات
 */
function addAriaLiveRegions() {
  // إضافة aria-live للإشعارات
  const notifications = document.querySelectorAll('.notification, .alert, .toast');
  notifications.forEach(notification => {
    if (!notification.hasAttribute('aria-live')) {
      // تحديد مستوى الأهمية
      let priority = 'polite';
      
      if (notification.classList.contains('alert-danger') || 
          notification.classList.contains('alert-error') || 
          notification.classList.contains('error')) {
        priority = 'assertive';
      }
      
      notification.setAttribute('aria-live', priority);
    }
  });
  
  // إضافة منطقة إشعارات عامة إذا لم تكن موجودة
  if (!document.querySelector('[aria-live="polite"]')) {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.classList.add('sr-only', 'live-region');
    document.body.appendChild(liveRegion);
  }
  
  // إضافة منطقة إشعارات مهمة إذا لم تكن موجودة
  if (!document.querySelector('[aria-live="assertive"]')) {
    const alertRegion = document.createElement('div');
    alertRegion.setAttribute('aria-live', 'assertive');
    alertRegion.setAttribute('aria-atomic', 'true');
    alertRegion.classList.add('sr-only', 'alert-region');
    document.body.appendChild(alertRegion);
  }
  
  // إضافة وظيفة لإظهار الإشعارات في مناطق الإشعارات
  window.announceToScreenReader = function(message, priority = 'polite') {
    const region = document.querySelector(`[aria-live="${priority}"]`);
    if (region) {
      region.textContent = '';
      setTimeout(() => {
        region.textContent = message;
      }, 100);
    }
  };
}
