/**
 * نظام تكامل التنبيهات الجديد مع الواجهات الحالية
 * يقوم بربط أحداث الواجهات مع نظام التنبيهات الموحد
 * تم تحديثه لإزالة رسائل "تم!" و "تم إضافة التعليق بنجاح!"
 */

class NotificationSystem {
    constructor() {
        this.toastQueue = [];
        this.isProcessing = false;
        this.initializeContainer();
    }

    initializeContainer() {
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(this.container);
    }

    showToast(message, type = 'success', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            padding: 12px 24px;
            background: ${this.getBackgroundColor(type)};
            color: ${this.getTextColor(type)};
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            pointer-events: auto;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            direction: rtl;
        `;

        const icon = this.getIcon(type);
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;

        this.container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        // Remove after duration
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    getBackgroundColor(type) {
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6'
        };
        return colors[type] || colors.info;
    }

    getTextColor(type) {
        return '#FFFFFF';
    }

    getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Initialize the notification system
const notifier = new NotificationSystem();

// Override the old alert system
window.showNotification = (message, type = 'success') => {
    notifier.showToast(message, type);
};

// Add styles to the document
const style = document.createElement('style');
style.textContent = `
    .toast {
        max-width: 400px;
        width: auto;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    @media (max-width: 768px) {
        .toast {
            max-width: 90vw;
        }
    }
`;
document.head.appendChild(style);

// Override default success messages
const successMessages = [
    'تم!',
    'تم إضافة التعليق بنجاح!',
    'تم بنجاح!',
    'تم الإضافة بنجاح!',
    'تم الحفظ!',
    'تم التعديل!',
    'تم الحذف!',
    'تم التحديث!'
];

// Replace old alert calls
const originalAlert = window.alert;
window.alert = function(message) {
    if (successMessages.includes(message.trim())) {
        // Don't show any notification for these messages
        return;
    } else {
        originalAlert(message);
    }
};

// Override SweetAlert2 if it exists
if (window.Swal) {
    const originalFire = window.Swal.fire;
    window.Swal.fire = function(options) {
        if (options.icon === 'success' && successMessages.includes(options.text?.trim())) {
            // Don't show any notification for these messages
            return Promise.resolve({ isConfirmed: true });
        }
        return originalFire.call(this, options);
    };
}

document.addEventListener('DOMContentLoaded', function() {
    // التحقق من وجود نظام التنبيهات
    if (typeof window.errorNotifier === 'undefined') {
        console.error('نظام التنبيهات غير متوفر!');
        return;
    }

    // قائمة الرسائل التي يجب تجاهلها
    const ignoredMessages = [
        'تم!',
        'تم إضافة التعليق بنجاح!',
        'تم بنجاح!',
        'تم الإضافة بنجاح!',
        'تم الحفظ!',
        'تم التعديل!',
        'تم الحذف!',
        'تم التحديث!'
    ];

    // دالة للتحقق مما إذا كانت الرسالة يجب تجاهلها
    function shouldIgnoreMessage(message) {
        return ignoredMessages.some(ignored => 
            message.trim() === ignored || 
            message.trim().includes(ignored)
        );
    }

    // البحث عن رسائل النجاح والخطأ الموجودة في الصفحة وعرضها باستخدام النظام الجديد
    const successMessages = document.querySelectorAll('.message-success, .alert-success, .success-message');
    const errorMessages = document.querySelectorAll('.message-error, .alert-danger, .error-message');
    const warningMessages = document.querySelectorAll('.message-warning, .alert-warning, .warning-message');
    const infoMessages = document.querySelectorAll('.message-info, .alert-info, .info-message');

    // عرض رسائل النجاح (مع تجاهل الرسائل المحددة)
    successMessages.forEach(function(element) {
        const messageText = element.textContent.trim();
        if (messageText && !shouldIgnoreMessage(messageText)) {
            window.errorNotifier.showSuccess(messageText);
        }
        // إخفاء الرسالة الأصلية بعد عرضها بالنظام الجديد
        element.style.display = 'none';
    });

    // عرض رسائل الخطأ
    errorMessages.forEach(function(element) {
        if (element.textContent.trim()) {
            window.errorNotifier.showError(element.textContent.trim());
            // إخفاء الرسالة الأصلية بعد عرضها بالنظام الجديد
            element.style.display = 'none';
        }
    });

    // عرض رسائل التحذير
    warningMessages.forEach(function(element) {
        if (element.textContent.trim()) {
            window.errorNotifier.showWarning(element.textContent.trim());
            // إخفاء الرسالة الأصلية بعد عرضها بالنظام الجديد
            element.style.display = 'none';
        }
    });

    // عرض رسائل المعلومات
    infoMessages.forEach(function(element) {
        if (element.textContent.trim()) {
            window.errorNotifier.showInfo(element.textContent.trim());
            // إخفاء الرسالة الأصلية بعد عرضها بالنظام الجديد
            element.style.display = 'none';
        }
    });

    // البحث عن منطقة التغذية الراجعة في صفحة الإشعارات وربطها بالنظام الجديد
    const feedbackArea = document.getElementById('feedback-message-area');
    if (feedbackArea) {
        // تعريف دالة عرض التغذية الراجعة الأصلية
        window.displayFeedback = function(message, type = 'success') {
            // تجاهل الرسائل المحددة
            if (shouldIgnoreMessage(message)) {
                return;
            }
            
            // استخدام النظام الجديد بدلاً من الأسلوب القديم
            if (type === 'success') {
                window.errorNotifier.showSuccess(message);
            } else if (type === 'error') {
                window.errorNotifier.showError(message);
            } else if (type === 'warning') {
                window.errorNotifier.showWarning(message);
            } else {
                window.errorNotifier.showInfo(message);
            }
        };
    }

    // ربط أحداث النماذج بنظام التنبيهات الجديد
    document.querySelectorAll('form').forEach(function(form) {
        // تجاوز نماذج التعليقات لتجنب رسائل "تم إضافة التعليق بنجاح!"
        if (form.classList.contains('comment-form')) {
            const originalSubmit = form.onsubmit;
            form.onsubmit = function(event) {
                // استدعاء الدالة الأصلية إذا كانت موجودة
                if (typeof originalSubmit === 'function') {
                    return originalSubmit.call(this, event);
                }
                return true;
            };
        } else {
            form.addEventListener('submit', function(event) {
                // التحقق من صحة النموذج قبل الإرسال
                if (!form.checkValidity()) {
                    event.preventDefault();
                    window.errorNotifier.showError('يرجى تصحيح الأخطاء في النموذج قبل الإرسال.');
                }
            });
        }
    });

    // اعتراض طلبات الشبكة وعرض أخطاء الاتصال
    const originalFetch = window.fetch;
    window.fetch = async function(url, options) {
        try {
            const response = await originalFetch(url, options);
            
            // التحقق من حالة الاستجابة
            if (!response.ok) {
                // محاولة قراءة رسالة الخطأ من الاستجابة
                try {
                    const errorData = await response.clone().json();
                    if (errorData && errorData.message) {
                        window.errorNotifier.showError(errorData.message);
                    } else {
                        window.errorNotifier.showError(`حدث خطأ: ${response.status} ${response.statusText}`);
                    }
                } catch (jsonError) {
                    window.errorNotifier.showError(`حدث خطأ: ${response.status} ${response.statusText}`);
                }
            }
            
            return response;
        } catch (error) {
            // عرض أخطاء الشبكة
            window.errorNotifier.handleNetworkError(error);
            throw error; // إعادة رمي الخطأ للتعامل معه في مكان آخر إذا لزم الأمر
        }
    };

    // إضافة معالج عام للأخطاء غير المتوقعة
    window.addEventListener('error', function(event) {
        window.errorNotifier.showError('حدث خطأ غير متوقع في الصفحة. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
        console.error('Unhandled error:', event.error);
    });

    // إضافة معالج للوعود غير المعالجة
    window.addEventListener('unhandledrejection', function(event) {
        window.errorNotifier.showError('فشلت عملية غير متوقعة. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
        console.error('Unhandled promise rejection:', event.reason);
    });

    console.log('تم تهيئة نظام التنبيهات الجديد بنجاح.');
});
