/**
 * التحقق من صحة النماذج في الوقت الفعلي
 * 
 * هذا الملف يضيف تحقق فوري من صحة النماذج وتوضيح الأخطاء للمستخدم
 * لتحسين تجربة المستخدم وتقليل الأخطاء
 */

document.addEventListener('DOMContentLoaded', function() {
  // تطبيق التحقق على جميع النماذج
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    setupFormValidation(form);
  });
});

/**
 * إعداد التحقق من صحة النموذج
 * @param {HTMLFormElement} form - عنصر النموذج
 */
function setupFormValidation(form) {
  // الحصول على جميع الحقول في النموذج
  const inputs = form.querySelectorAll('input, select, textarea');
  
  // إضافة مستمعات أحداث للتحقق في الوقت الفعلي
  inputs.forEach(input => {
    // تخطي الأزرار وحقول الإرسال
    if (input.type === 'submit' || input.type === 'button' || input.type === 'reset') {
      return;
    }
    
    // إضافة مستمع للتحقق عند تغيير القيمة
    input.addEventListener('input', function() {
      validateField(input);
    });
    
    // إضافة مستمع للتحقق عند فقدان التركيز
    input.addEventListener('blur', function() {
      validateField(input, true);
    });
  });
  
  // إضافة مستمع للتحقق عند إرسال النموذج
  form.addEventListener('submit', function(e) {
    // التحقق من جميع الحقول
    let isValid = true;
    
    inputs.forEach(input => {
      // تخطي الأزرار وحقول الإرسال
      if (input.type === 'submit' || input.type === 'button' || input.type === 'reset') {
        return;
      }
      
      // التحقق من الحقل
      const fieldValid = validateField(input, true);
      isValid = isValid && fieldValid;
    });
    
    // منع إرسال النموذج إذا كان هناك أخطاء
    if (!isValid) {
      e.preventDefault();
      
      // التمرير إلى أول حقل به خطأ
      const firstInvalidField = form.querySelector('.is-invalid');
      if (firstInvalidField) {
        firstInvalidField.focus();
        
        // إظهار رسالة خطأ عامة
        showFormError(form, 'يرجى تصحيح الأخطاء المشار إليها أدناه قبل الإرسال.');
      }
    } else {
      // إظهار رسالة نجاح
      showFormSuccess(form, 'جاري إرسال النموذج...');
    }
  });
}

/**
 * التحقق من صحة حقل معين
 * @param {HTMLElement} field - عنصر الحقل
 * @param {boolean} showError - ما إذا كان يجب إظهار رسالة الخطأ
 * @returns {boolean} - ما إذا كان الحقل صالحاً
 */
function validateField(field, showError = false) {
  // الحصول على قيمة الحقل
  const value = field.value.trim();
  
  // التحقق من الحقول المطلوبة
  if (field.hasAttribute('required') && value === '') {
    if (showError) {
      showFieldError(field, 'هذا الحقل مطلوب');
    }
    return false;
  }
  
  // التحقق من البريد الإلكتروني
  if (field.type === 'email' && value !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      if (showError) {
        showFieldError(field, 'يرجى إدخال بريد إلكتروني صالح');
      }
      return false;
    }
  }
  
  // التحقق من رقم الهاتف
  if ((field.type === 'tel' || field.name.includes('phone') || field.id.includes('phone')) && value !== '') {
    const phoneRegex = /^[\d\+\-\(\) ]{8,15}$/;
    if (!phoneRegex.test(value)) {
      if (showError) {
        showFieldError(field, 'يرجى إدخال رقم هاتف صالح');
      }
      return false;
    }
  }
  
  // التحقق من كلمة المرور
  if ((field.type === 'password' || field.name.includes('password') || field.id.includes('password')) && value !== '') {
    // التحقق من طول كلمة المرور
    if (value.length < 8) {
      if (showError) {
        showFieldError(field, 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل');
      }
      return false;
    }
    
    // التحقق من تعقيد كلمة المرور
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    if (!(hasUpperCase && hasLowerCase && hasNumbers) || !hasSpecialChars) {
      if (showError) {
        showFieldError(field, 'يجب أن تحتوي كلمة المرور على أحرف كبيرة وصغيرة وأرقام ورموز خاصة');
      }
      return false;
    }
  }
  
  // التحقق من تطابق كلمة المرور
  if ((field.name.includes('confirm') || field.id.includes('confirm')) && field.name.includes('password')) {
    const passwordField = field.form.querySelector('input[type="password"]:not([name*="confirm"]):not([id*="confirm"])');
    if (passwordField && value !== passwordField.value) {
      if (showError) {
        showFieldError(field, 'كلمات المرور غير متطابقة');
      }
      return false;
    }
  }
  
  // التحقق من الحد الأدنى والأقصى للطول
  if (field.hasAttribute('minlength') && value !== '') {
    const minLength = parseInt(field.getAttribute('minlength'));
    if (value.length < minLength) {
      if (showError) {
        showFieldError(field, `يجب أن يتكون هذا الحقل من ${minLength} أحرف على الأقل`);
      }
      return false;
    }
  }
  
  if (field.hasAttribute('maxlength') && value !== '') {
    const maxLength = parseInt(field.getAttribute('maxlength'));
    if (value.length > maxLength) {
      if (showError) {
        showFieldError(field, `يجب أن لا يتجاوز هذا الحقل ${maxLength} حرف`);
      }
      return false;
    }
  }
  
  // التحقق من النطاق
  if (field.type === 'number' && value !== '') {
    if (field.hasAttribute('min')) {
      const min = parseFloat(field.getAttribute('min'));
      if (parseFloat(value) < min) {
        if (showError) {
          showFieldError(field, `يجب أن تكون القيمة ${min} أو أكبر`);
        }
        return false;
      }
    }
    
    if (field.hasAttribute('max')) {
      const max = parseFloat(field.getAttribute('max'));
      if (parseFloat(value) > max) {
        if (showError) {
          showFieldError(field, `يجب أن تكون القيمة ${max} أو أقل`);
        }
        return false;
      }
    }
  }
  
  // التحقق من نمط محدد
  if (field.hasAttribute('pattern') && value !== '') {
    const pattern = new RegExp(field.getAttribute('pattern'));
    if (!pattern.test(value)) {
      if (showError) {
        showFieldError(field, field.getAttribute('title') || 'يرجى إدخال قيمة بالتنسيق المطلوب');
      }
      return false;
    }
  }
  
  // إذا وصلنا إلى هنا، فالحقل صالح
  showFieldSuccess(field);
  return true;
}

/**
 * إظهار رسالة خطأ لحقل معين
 * @param {HTMLElement} field - عنصر الحقل
 * @param {string} message - رسالة الخطأ
 */
function showFieldError(field, message) {
  // إزالة رسائل الخطأ السابقة
  removeFieldFeedback(field);
  
  // إضافة فئة الخطأ
  field.classList.add('is-invalid');
  field.classList.remove('is-valid');
  
  // إضافة رسالة الخطأ
  const feedbackElement = document.createElement('div');
  feedbackElement.className = 'invalid-feedback';
  feedbackElement.textContent = message;
  
  // إضافة خاصية ARIA
  field.setAttribute('aria-invalid', 'true');
  
  // إضافة معرف فريد للرسالة
  const feedbackId = `${field.id || field.name}-feedback`;
  feedbackElement.id = feedbackId;
  field.setAttribute('aria-describedby', feedbackId);
  
  // إضافة الرسالة بعد الحقل
  field.parentNode.appendChild(feedbackElement);
  
  // إضافة أيقونة الخطأ
  addFieldIcon(field, 'error');
}

/**
 * إظهار رسالة نجاح لحقل معين
 * @param {HTMLElement} field - عنصر الحقل
 */
function showFieldSuccess(field) {
  // إزالة رسائل التغذية الراجعة السابقة
  removeFieldFeedback(field);
  
  // إضافة فئة النجاح
  field.classList.add('is-valid');
  field.classList.remove('is-invalid');
  
  // إزالة خاصية ARIA
  field.setAttribute('aria-invalid', 'false');
  
  // إضافة أيقونة النجاح
  addFieldIcon(field, 'success');
}

/**
 * إزالة رسائل التغذية الراجعة لحقل معين
 * @param {HTMLElement} field - عنصر الحقل
 */
function removeFieldFeedback(field) {
  // إزالة رسائل الخطأ
  const invalidFeedback = field.parentNode.querySelector('.invalid-feedback');
  if (invalidFeedback) {
    invalidFeedback.remove();
  }
  
  // إزالة رسائل النجاح
  const validFeedback = field.parentNode.querySelector('.valid-feedback');
  if (validFeedback) {
    validFeedback.remove();
  }
  
  // إزالة الأيقونات
  const icons = field.parentNode.querySelectorAll('.field-icon');
  icons.forEach(icon => icon.remove());
}

/**
 * إضافة أيقونة لحقل معين
 * @param {HTMLElement} field - عنصر الحقل
 * @param {string} type - نوع الأيقونة ('error' أو 'success')
 */
function addFieldIcon(field, type) {
  // إزالة الأيقونات السابقة
  const icons = field.parentNode.querySelectorAll('.field-icon');
  icons.forEach(icon => icon.remove());
  
  // إنشاء عنصر الأيقونة
  const iconElement = document.createElement('span');
  iconElement.className = `field-icon field-icon-${type}`;
  
  // تعيين الأيقونة حسب النوع
  if (type === 'error') {
    iconElement.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
  } else if (type === 'success') {
    iconElement.innerHTML = '<i class="fas fa-check-circle"></i>';
  }
  
  // تحديد موضع الأيقونة
  const fieldRect = field.getBoundingClientRect();
  iconElement.style.position = 'absolute';
  iconElement.style.top = '50%';
  iconElement.style.transform = 'translateY(-50%)';
  iconElement.style.right = '10px';
  
  // التأكد من أن الحاوية لها موضع نسبي
  if (getComputedStyle(field.parentNode).position === 'static') {
    field.parentNode.style.position = 'relative';
  }
  
  // إضافة الأيقونة
  field.parentNode.appendChild(iconElement);
}

/**
 * إظهار رسالة خطأ عامة للنموذج
 * @param {HTMLFormElement} form - عنصر النموذج
 * @param {string} message - رسالة الخطأ
 */
function showFormError(form, message) {
  // إزالة رسائل الخطأ السابقة
  removeFormMessages(form);
  
  // إنشاء عنصر رسالة الخطأ
  const errorElement = document.createElement('div');
  errorElement.className = 'alert alert-danger form-error';
  errorElement.setAttribute('role', 'alert');
  errorElement.innerHTML = `
    <i class="fas fa-exclamation-triangle"></i>
    <span>${message}</span>
  `;
  
  // إضافة الرسالة في بداية النموذج
  form.prepend(errorElement);
  
  // تمرير للرسالة
  errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // إضافة تأثير الاهتزاز
  errorElement.classList.add('shake-effect');
  
  // إزالة تأثير الاهتزاز بعد انتهائه
  setTimeout(() => {
    errorElement.classList.remove('shake-effect');
  }, 500);
}

/**
 * إظهار رسالة نجاح عامة للنموذج
 * @param {HTMLFormElement} form - عنصر النموذج
 * @param {string} message - رسالة النجاح
 */
function showFormSuccess(form, message) {
  // إزالة رسائل النجاح السابقة
  removeFormMessages(form);
  
  // إنشاء عنصر رسالة النجاح
  const successElement = document.createElement('div');
  successElement.className = 'alert alert-success form-success';
  successElement.setAttribute('role', 'alert');
  successElement.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${message}</span>
  `;
  
  // إضافة الرسالة في بداية النموذج
  form.prepend(successElement);
}

/**
 * إزالة رسائل النموذج
 * @param {HTMLFormElement} form - عنصر النموذج
 */
function removeFormMessages(form) {
  // إزالة رسائل الخطأ
  const errorMessages = form.querySelectorAll('.form-error');
  errorMessages.forEach(message => message.remove());
  
  // إزالة رسائل النجاح
  const successMessages = form.querySelectorAll('.form-success');
  successMessages.forEach(message => message.remove());
}

/**
 * إضافة أنماط CSS للتحقق من صحة النماذج
 */
function addFormValidationStyles() {
  // إنشاء عنصر style
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* أنماط التحقق من صحة النماذج */
    .is-invalid {
      border-color: #dc3545 !important;
      padding-right: 2.25rem !important;
      background-image: none !important;
    }
    
    .is-valid {
      border-color: #28a745 !important;
      padding-right: 2.25rem !important;
      background-image: none !important;
    }
    
    .invalid-feedback {
      display: block;
      width: 100%;
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: #dc3545;
    }
    
    .valid-feedback {
      display: block;
      width: 100%;
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: #28a745;
    }
    
    .field-icon {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
    }
    
    .field-icon-error {
      color: #dc3545;
    }
    
    .field-icon-success {
      color: #28a745;
    }
    
    /* تأثير الاهتزاز */
    .shake-effect {
      animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    /* تنسيق رسائل النموذج */
    .alert {
      position: relative;
      padding: 0.75rem 1.25rem;
      margin-bottom: 1rem;
      border: 1px solid transparent;
      border-radius: 0.25rem;
      display: flex;
      align-items: center;
    }
    
    .alert i {
      margin-left: 0.75rem;
      font-size: 1.25rem;
    }
    
    .alert-danger {
      color: #721c24;
      background-color: #f8d7da;
      border-color: #f5c6cb;
    }
    
    .alert-success {
      color: #155724;
      background-color: #d4edda;
      border-color: #c3e6cb;
    }
  `;
  
  // إضافة الأنماط إلى الصفحة
  document.head.appendChild(styleElement);
}

// إضافة أنماط التحقق من صحة النماذج
addFormValidationStyles();
