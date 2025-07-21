/**
 * منظف الكونسول العام - Global Console Cleaner
 * يقوم بإزالة جميع استدعاءات console من جميع ملفات JavaScript في الموقع
 */

(function() {
  'use strict';

  // تعطيل فوري لجميع دوال الكونسول
  const disableConsole = () => {
    const noop = () => {};
    
    // قائمة بجميع دوال الكونسول
    const consoleMethods = [
      'log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml',
      'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile',
      'profileEnd', 'table', 'exception', 'mark', 'clear', 'groupCollapsed',
      'timeLog', 'countReset', 'timeStamp'
    ];

    // تعطيل كل دالة
    consoleMethods.forEach(method => {
      if (console[method]) {
        console[method] = noop;
      }
    });
  };

  // تشغيل التعطيل فوراً
  disableConsole();

  // تعطيل الأخطاء والتحذيرات
  window.onerror = function(msg, url, lineNo, columnNo, error) {
    return true; // منع ظهور الخطأ
  };

  window.addEventListener('error', function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

  // تعطيل أخطاء Promise
  window.addEventListener('unhandledrejection', function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

  // تعطيل تحذيرات الأمان
  window.addEventListener('securitypolicyviolation', function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

  // منع إعادة تعريف الكونسول
  try {
    Object.defineProperty(window, 'console', {
      get: function() {
        return {
          log: function() {},
          debug: function() {},
          info: function() {},
          warn: function() {},
          error: function() {},
          assert: function() {},
          dir: function() {},
          dirxml: function() {},
          group: function() {},
          groupEnd: function() {},
          time: function() {},
          timeEnd: function() {},
          count: function() {},
          trace: function() {},
          profile: function() {},
          profileEnd: function() {},
          table: function() {},
          exception: function() {},
          mark: function() {},
          clear: function() {},
          groupCollapsed: function() {},
          timeLog: function() {},
          countReset: function() {},
          timeStamp: function() {}
        };
      },
      set: function() {
        // منع إعادة تعيين الكونسول
      }
    });
  } catch (e) {
    // تجاهل الأخطاء
  }

  // تنظيف الكونسول من أي رسائل موجودة
  try {
    console.clear();
  } catch (e) {
    // تجاهل الأخطاء
  }

  // منع استخدام eval و Function constructor للوصول للكونسول
  const originalEval = window.eval;
  window.eval = function(code) {
    if (typeof code === 'string' && code.includes('console')) {
      return;
    }
    return originalEval.call(this, code);
  };

  const originalFunction = window.Function;
  window.Function = function() {
    const args = Array.prototype.slice.call(arguments);
    const code = args[args.length - 1];
    if (typeof code === 'string' && code.includes('console')) {
      return function() {};
    }
    return originalFunction.apply(this, arguments);
  };

  // تعطيل debugger statements
  const originalSetTimeout = window.setTimeout;
  window.setTimeout = function(fn, delay) {
    if (typeof fn === 'string' && fn.includes('debugger')) {
      return;
    }
    return originalSetTimeout.apply(this, arguments);
  };

  const originalSetInterval = window.setInterval;
  window.setInterval = function(fn, delay) {
    if (typeof fn === 'string' && fn.includes('debugger')) {
      return;
    }
    return originalSetInterval.apply(this, arguments);
  };

})();

// تشغيل إضافي عند تحميل DOM
document.addEventListener('DOMContentLoaded', function() {
  // تنظيف أي رسائل كونسول متبقية
  try {
    console.clear();
  } catch (e) {
    // تجاهل الأخطاء
  }
});

// تشغيل إضافي عند تحميل النافذة بالكامل
window.addEventListener('load', function() {
  // تنظيف نهائي
  try {
    console.clear();
  } catch (e) {
    // تجاهل الأخطاء
  }
});

