/**
 * تعطيل جميع طباعات الكونسول في الموقع
 * Console Disabler - يمنع ظهور أي رسائل في وحدة التحكم
 */

(function() {
  'use strict';
  
  // حفظ الدوال الأصلية (في حالة الحاجة لاستعادتها لاحقاً)
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug,
    trace: console.trace,
    dir: console.dir,
    dirxml: console.dirxml,
    table: console.table,
    group: console.group,
    groupCollapsed: console.groupCollapsed,
    groupEnd: console.groupEnd,
    time: console.time,
    timeEnd: console.timeEnd,
    timeLog: console.timeLog,
    count: console.count,
    countReset: console.countReset,
    assert: console.assert,
    clear: console.clear
  };

  // دالة فارغة لاستبدال جميع دوال الكونسول
  const emptyFunction = function() {};

  // تعطيل جميع دوال الكونسول
  console.log = emptyFunction;
  console.warn = emptyFunction;
  console.error = emptyFunction;
  console.info = emptyFunction;
  console.debug = emptyFunction;
  console.trace = emptyFunction;
  console.dir = emptyFunction;
  console.dirxml = emptyFunction;
  console.table = emptyFunction;
  console.group = emptyFunction;
  console.groupCollapsed = emptyFunction;
  console.groupEnd = emptyFunction;
  console.time = emptyFunction;
  console.timeEnd = emptyFunction;
  console.timeLog = emptyFunction;
  console.count = emptyFunction;
  console.countReset = emptyFunction;
  console.assert = emptyFunction;
  console.clear = emptyFunction;

  // تعطيل alert و confirm و prompt (اختياري)
  window.alert = emptyFunction;
  window.confirm = function() { return false; };
  window.prompt = function() { return null; };

  // منع فتح أدوات المطور (اختياري - قد يؤثر على تجربة المطور)
  /*
  document.addEventListener('keydown', function(e) {
    // منع F12
    if (e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
    // منع Ctrl+Shift+I
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
      e.preventDefault();
      return false;
    }
    // منع Ctrl+Shift+J
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
      e.preventDefault();
      return false;
    }
    // منع Ctrl+U
    if (e.ctrlKey && e.keyCode === 85) {
      e.preventDefault();
      return false;
    }
  });

  // منع النقر بالزر الأيمن (اختياري)
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });
  */

  // دالة لاستعادة الكونسول (للمطورين فقط)
  window.restoreConsole = function() {
    Object.assign(console, originalConsole);
    console.log('تم استعادة وحدة التحكم');
  };

  // دالة لتعطيل الكونسول مرة أخرى
  window.disableConsole = function() {
    Object.keys(originalConsole).forEach(key => {
      console[key] = emptyFunction;
    });
  };

  // تعطيل الأخطاء JavaScript من الظهور في الكونسول
  window.onerror = function(message, source, lineno, colno, error) {
    // منع ظهور الأخطاء في الكونسول
    return true;
  };

  // تعطيل الأخطاء غير المعالجة من Promise
  window.addEventListener('unhandledrejection', function(event) {
    event.preventDefault();
  });

  // تعطيل تحذيرات الأمان في الكونسول
  if (typeof Object.defineProperty === 'function') {
    Object.defineProperty(window, 'console', {
      value: console,
      writable: false,
      configurable: false
    });
  }

  // رسالة تأكيد (ستظهر مرة واحدة فقط قبل التعطيل)
  if (originalConsole.log) {
    originalConsole.log('تم تعطيل وحدة التحكم بنجاح');
  }

})();

// تعطيل إضافي لأي محاولات لاستخدام الكونسول
(function() {
  try {
    var $_console$$ = console;
    Object.defineProperty(window, "console", {
      get: function() {
        if ($_console$$._commandLineAPI) {
          throw "للأسف، لا يمكن استخدام وحدة التحكم هنا!";
        }
        return $_console$$;
      },
      set: function(val) {
        $_console$$ = val;
      }
    });
  } catch (e) {
    // تجاهل الأخطاء
  }
})();

