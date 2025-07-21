/**
 * نظام معالجة صور الأفاتار
 * يحل مشكلة عدم تحميل صور الأفاتار في طلبات التوظيف وأماكن أخرى
 */

document.addEventListener('DOMContentLoaded', function() {
  // تحديد جميع صور الأفاتار في الصفحة
  const avatarImages = document.querySelectorAll('.applicant-avatar, .profile-picture, .post-avatar img, .comment-avatar, .avatar');
  
  // معالجة كل صورة
  avatarImages.forEach(img => {
    // تعيين صورة افتراضية في حالة الخطأ
    img.onerror = function() {
      // التحقق من أن الصورة ليست بالفعل الصورة الافتراضية
      if (!this.src.includes('pngwing.com.png') && !this.src.includes('default-avatar.png')) {
        this.src = '/uploads/images/pngwing.com.png';
      }
    };
    
    // إضافة خاصية التحميل الكسول للصور
    img.loading = 'lazy';
    
    // إضافة خاصية decoding لتحسين الأداء
    img.decoding = 'async';
    
    // تعيين نسبة العرض إلى الارتفاع لمنع تغير تخطيط الصفحة
    img.setAttribute('width', img.width || 50);
    img.setAttribute('height', img.height || 50);
    
    // إضافة فئة للتأثيرات البصرية
    img.classList.add('optimized-avatar');
  });
  
  // تصحيح مسارات الصور الخاطئة
  function fixAvatarPaths() {
    const avatarImages = document.querySelectorAll('.applicant-avatar, .profile-picture, .post-avatar img, .comment-avatar, .avatar');
    
    avatarImages.forEach(img => {
      const src = img.getAttribute('src');
      
      // تخطي الصور التي ليس لها مصدر
      if (!src) return;
      
      // تصحيح المسارات التي لا تبدأ بـ / أو http
      if (!src.startsWith('/') && !src.startsWith('http')) {
        // إذا كان المسار يحتوي على uploads/avatars، أضف / في البداية
        if (src.includes('uploads/avatars/')) {
          img.src = '/' + src;
        } 
        // وإلا، افترض أنه اسم ملف فقط وأضفه إلى المسار الصحيح
        else if (!src.includes('/')) {
          img.src = '/uploads/avatars/' + src;
        }
      }
      
      // تصحيح المسارات التي تحتوي على مسارات مكررة
      if (src.includes('uploads/avatars/uploads/avatars/')) {
        img.src = src.replace('uploads/avatars/uploads/avatars/', 'uploads/avatars/');
      }
    });
  }
  
  // تنفيذ تصحيح المسارات
  fixAvatarPaths();
  
  // إضافة مراقب للتغييرات في DOM لمعالجة الصور المضافة ديناميكيًا
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        setTimeout(fixAvatarPaths, 100);
      }
    });
  });
  
  // بدء مراقبة التغييرات في DOM
  observer.observe(document.body, { childList: true, subtree: true });
});

// تصدير دالة مساعدة لتصحيح مسار الأفاتار
function getCorrectAvatarPath(avatarPath) {
  if (!avatarPath) {
    return '/uploads/images/pngwing.com.png';
  }
  
  if (avatarPath.includes('/uploads/avatars/')) {
    return avatarPath;
  }
  
  if (avatarPath.startsWith('http')) {
    return avatarPath;
  }
  
  return '/uploads/avatars/' + avatarPath;
}

// إضافة الدالة إلى الكائن العام window
window.getCorrectAvatarPath = getCorrectAvatarPath;
