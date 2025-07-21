// Performance Optimizer Script
// تحسين الأداء وتقليل وقت التحميل

(function() {
    'use strict';

    // تحسين تحميل الصور
    function optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // إضافة lazy loading للصور
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // تحسين أبعاد الصور
            img.addEventListener('load', function() {
                const naturalWidth = this.naturalWidth;
                const naturalHeight = this.naturalHeight;
                const displayWidth = this.offsetWidth;
                const displayHeight = this.offsetHeight;
                
                // تحذير إذا كانت الصورة أكبر من المطلوب
                if (naturalWidth > displayWidth * 2 || naturalHeight > displayHeight * 2) {
                    console.warn('صورة غير محسنة:', this.src, 
                        'الحجم الطبيعي:', naturalWidth + 'x' + naturalHeight,
                        'الحجم المعروض:', displayWidth + 'x' + displayHeight);
                }
            });
        });
    }

    // تحسين تحميل الخطوط
    function optimizeFonts() {
        // إضافة font-display: swap للخطوط المحملة ديناميكياً
        const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
        fontLinks.forEach(link => {
            if (!link.href.includes('display=swap')) {
                link.href += link.href.includes('?') ? '&display=swap' : '?display=swap';
            }
        });
    }

    // تحسين تحميل الموارد الخارجية
    function optimizeExternalResources() {
        // إضافة preconnect للنطاقات الخارجية المهمة
        const domains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://cdnjs.cloudflare.com',
            'https://res.cloudinary.com'
        ];

        domains.forEach(domain => {
            const existingPreconnect = document.querySelector(`link[rel="preconnect"][href="${domain}"]`);
            if (!existingPreconnect) {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = domain;
                if (domain.includes('gstatic')) {
                    link.crossOrigin = 'anonymous';
                }
                document.head.appendChild(link);
            }
        });
    }

    // تحسين معالجة الأحداث
    function optimizeEventHandlers() {
        // استخدام passive listeners للأحداث التي لا تحتاج preventDefault
        const passiveEvents = ['scroll', 'wheel', 'touchstart', 'touchmove'];
        
        passiveEvents.forEach(eventType => {
            const originalAddEventListener = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                if (passiveEvents.includes(type) && typeof options !== 'object') {
                    options = { passive: true };
                }
                return originalAddEventListener.call(this, type, listener, options);
            };
        });
    }

    // تحسين DOM
    function optimizeDOM() {
        // تقليل عدد عمليات reflow
        const observer = new MutationObserver(function(mutations) {
            let hasLayoutChanges = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' || 
                    (mutation.type === 'attributes' && 
                     ['style', 'class'].includes(mutation.attributeName))) {
                    hasLayoutChanges = true;
                }
            });
            
            if (hasLayoutChanges) {
                // تجميع التغييرات وتطبيقها دفعة واحدة
                requestAnimationFrame(function() {
                    // تطبيق التحسينات هنا
                });
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }

    // تحسين تحميل المحتوى
    function optimizeContentLoading() {
        // تأجيل تحميل المحتوى غير المرئي
        const intersectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // تحميل الصور المؤجلة
                    if (element.dataset.src) {
                        element.src = element.dataset.src;
                        element.removeAttribute('data-src');
                    }
                    
                    // تحميل المحتوى المؤجل
                    if (element.dataset.content) {
                        element.innerHTML = element.dataset.content;
                        element.removeAttribute('data-content');
                    }
                    
                    intersectionObserver.unobserve(element);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        // مراقبة العناصر المؤجلة
        document.querySelectorAll('[data-src], [data-content]').forEach(function(element) {
            intersectionObserver.observe(element);
        });
    }

    // تحسين الذاكرة
    function optimizeMemory() {
        // تنظيف event listeners غير المستخدمة
        window.addEventListener('beforeunload', function() {
            // تنظيف المراقبين
            if (window.performanceObserver) {
                window.performanceObserver.disconnect();
            }
        });
    }

    // مراقبة الأداء
    function monitorPerformance() {
        if ('PerformanceObserver' in window) {
            // مراقبة LCP
            const lcpObserver = new PerformanceObserver(function(list) {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // مراقبة FID
            const fidObserver = new PerformanceObserver(function(list) {
                const entries = list.getEntries();
                entries.forEach(function(entry) {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // مراقبة CLS
            const clsObserver = new PerformanceObserver(function(list) {
                const entries = list.getEntries();
                entries.forEach(function(entry) {
                    if (!entry.hadRecentInput) {
                        console.log('CLS:', entry.value);
                    }
                });
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }

    // تشغيل التحسينات
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                optimizeImages();
                optimizeFonts();
                optimizeExternalResources();
                optimizeEventHandlers();
                optimizeDOM();
                optimizeContentLoading();
                optimizeMemory();
                monitorPerformance();
            });
        } else {
            optimizeImages();
            optimizeFonts();
            optimizeExternalResources();
            optimizeEventHandlers();
            optimizeDOM();
            optimizeContentLoading();
            optimizeMemory();
            monitorPerformance();
        }
    }

    // بدء التحسين
    init();

})();

