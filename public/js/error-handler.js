/**
 * معالج الأخطاء المحسن لموقع أمل حبرك
 * يمنع ظهور تنبيهات 404 غير مرغوبة ويحسن تجربة المستخدم
 */

(function() {
    'use strict';

    // منع ظهور تنبيهات 404 غير مرغوبة
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args)
            .catch(error => {
                // تسجيل الخطأ بصمت دون إظهار تنبيه
                console.warn('Network request failed:', error);
                return Promise.reject(error);
            });
    };

    // معالجة أخطاء XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this.addEventListener('error', function() {
            // تسجيل الخطأ بصمت
            console.warn('XHR request failed:', url);
        });
        
        this.addEventListener('load', function() {
            if (this.status === 404) {
                // تسجيل 404 بصمت دون إظهار تنبيه
                console.warn('Resource not found (404):', url);
            }
        });
        
        return originalXHROpen.call(this, method, url, ...args);
    };

    // منع ظهور تنبيهات JavaScript العامة غير المرغوبة
    const originalAlert = window.alert;
    window.alert = function(message) {
        // فلترة الرسائل غير المرغوبة
        const unwantedMessages = [
            '404',
            'not found',
            'error',
            'gibson',
            'interrogation',
            'failed to load',
            'network error'
        ];
        
        const messageStr = String(message).toLowerCase();
        const isUnwanted = unwantedMessages.some(unwanted => 
            messageStr.includes(unwanted)
        );
        
        if (!isUnwanted) {
            // إظهار التنبيه فقط إذا لم يكن من الرسائل غير المرغوبة
            return originalAlert.call(this, message);
        } else {
            // تسجيل الرسالة في وحدة التحكم بدلاً من إظهار تنبيه
            console.warn('Suppressed alert:', message);
        }
    };

    // معالجة أخطاء الصور المفقودة
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            // استبدال الصور المفقودة بصورة افتراضية
            e.target.src = '/uploads/default-image.png';
            e.target.alt = 'صورة غير متوفرة';
            console.warn('Image not found, using default:', e.target.src);
        }
    }, true);

    // معالجة أخطاء تحميل الملفات CSS/JS
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'LINK' || e.target.tagName === 'SCRIPT') {
            console.warn('Resource failed to load:', e.target.src || e.target.href);
            // لا نظهر تنبيه للمستخدم
        }
    }, true);

    // معالجة الأخطاء العامة في JavaScript
    window.addEventListener('error', function(e) {
        // تسجيل الخطأ دون إظهار تنبيه
        console.error('JavaScript error:', e.error);
        
        // منع إظهار التنبيهات للأخطاء الشائعة
        const commonErrors = [
            'Script error',
            'Network request failed',
            'Failed to fetch',
            'Load failed',
            '404'
        ];
        
        const errorMessage = e.message || '';
        const isCommonError = commonErrors.some(common => 
            errorMessage.includes(common)
        );
        
        if (isCommonError) {
            e.preventDefault();
        }
    });

    // معالجة Promise rejections غير المعالجة
    window.addEventListener('unhandledrejection', function(e) {
        console.warn('Unhandled promise rejection:', e.reason);
        
        // منع إظهار تنبيهات للأخطاء الشائعة
        const reason = String(e.reason).toLowerCase();
        if (reason.includes('404') || reason.includes('network') || reason.includes('fetch')) {
            e.preventDefault();
        }
    });

    // تحسين نظام التنبيهات المخصص
    window.showNotification = function(message, type = 'info', duration = 5000) {
        // إنشاء نظام تنبيهات مخصص أكثر أناقة
        const notification = document.createElement('div');
        notification.className = `custom-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="notification-icon fas ${getIconForType(type)}"></i>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // إضافة الأنماط إذا لم تكن موجودة
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .custom-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10000;
                    min-width: 300px;
                    max-width: 500px;
                    animation: slideIn 0.3s ease-out;
                }
                
                .notification-content {
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .notification-icon {
                    font-size: 18px;
                    flex-shrink: 0;
                }
                
                .notification-message {
                    flex: 1;
                    font-size: 14px;
                    line-height: 1.4;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }
                
                .notification-close:hover {
                    opacity: 1;
                    background: rgba(0,0,0,0.1);
                }
                
                .notification-success {
                    border-left: 4px solid #28a745;
                }
                
                .notification-success .notification-icon {
                    color: #28a745;
                }
                
                .notification-error {
                    border-left: 4px solid #dc3545;
                }
                
                .notification-error .notification-icon {
                    color: #dc3545;
                }
                
                .notification-warning {
                    border-left: 4px solid #ffc107;
                }
                
                .notification-warning .notification-icon {
                    color: #ffc107;
                }
                
                .notification-info {
                    border-left: 4px solid #17a2b8;
                }
                
                .notification-info .notification-icon {
                    color: #17a2b8;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @media (max-width: 768px) {
                    .custom-notification {
                        right: 10px;
                        left: 10px;
                        min-width: auto;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // إزالة التنبيه تلقائياً بعد المدة المحددة
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.style.animation = 'slideIn 0.3s ease-out reverse';
                    setTimeout(() => notification.remove(), 300);
                }
            }, duration);
        }
    };

    function getIconForType(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // استبدال console.error للأخطاء الحرجة فقط
    const originalConsoleError = console.error;
    console.error = function(...args) {
        const message = args.join(' ');
        
        // تجاهل الأخطاء الشائعة غير المهمة
        const ignoredErrors = [
            'Failed to load resource',
            'net::ERR_FAILED',
            '404',
            'Script error',
            'Non-Error promise rejection captured'
        ];
        
        const shouldIgnore = ignoredErrors.some(ignored => 
            message.includes(ignored)
        );
        
        if (!shouldIgnore) {
            originalConsoleError.apply(console, args);
        }
    };

    // تحسين معالجة النماذج
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.tagName === 'FORM') {
            // إضافة مؤشر تحميل
            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent || submitBtn.value;
                submitBtn.disabled = true;
                submitBtn.textContent = 'جاري الإرسال...';
                
                // استعادة النص الأصلي بعد 5 ثوان كحد أقصى
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }, 5000);
            }
        }
    });

    // تحسين تجربة التنقل
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href) {
            // التحقق من صحة الرابط قبل التنقل
            if (link.href.includes('javascript:') || link.href.includes('#')) {
                return; // السماح بالروابط الداخلية
            }
            
            // إضافة مؤشر تحميل للروابط الخارجية
            if (link.hostname !== window.location.hostname) {
                link.style.opacity = '0.7';
                link.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    link.style.opacity = '';
                    link.style.pointerEvents = '';
                }, 2000);
            }
        }
    });

    // تحسين أداء الصفحة
    document.addEventListener('DOMContentLoaded', function() {
        // تحميل كسول للصور
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
        
        // إخفاء مؤشر التحميل إذا كان موجوداً
        const loader = document.querySelector('.page-loader, .loading-spinner, #loader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 300);
            }, 500);
        }
    });

    console.log('Error handler initialized successfully');
})();

