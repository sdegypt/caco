// تحسين الصور والأداء
(function() {
    'use strict';

    // تحسين حجم الصور
    function optimizeImageSizes() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // تحسين الصور الكبيرة
            img.addEventListener('load', function() {
                const displayWidth = img.offsetWidth;
                const displayHeight = img.offsetHeight;
                const naturalWidth = img.naturalWidth;
                const naturalHeight = img.naturalHeight;
                
                // إذا كانت الصورة أكبر من المطلوب بكثير
                if (naturalWidth > displayWidth * 2 || naturalHeight > displayHeight * 2) {
                    console.warn(`صورة كبيرة جداً: ${img.src}. الحجم الطبيعي: ${naturalWidth}x${naturalHeight}, الحجم المعروض: ${displayWidth}x${displayHeight}`);
                    
                    // إضافة تحذير للمطور
                    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                        img.style.border = '2px solid red';
                        img.title = 'صورة غير محسنة - الحجم كبير جداً';
                    }
                }
            });
        });
    }

    // تحسين تحميل الصور التدريجي
    function implementProgressiveLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // fallback للمتصفحات القديمة
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    // تحسين تنسيق الصور
    function optimizeImageFormats() {
        // التحقق من دعم WebP
        function supportsWebP() {
            return new Promise(resolve => {
                const webP = new Image();
                webP.onload = webP.onerror = () => {
                    resolve(webP.height === 2);
                };
                webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
            });
        }

        // التحقق من دعم AVIF
        function supportsAVIF() {
            return new Promise(resolve => {
                const avif = new Image();
                avif.onload = avif.onerror = () => {
                    resolve(avif.height === 2);
                };
                avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
            });
        }

        Promise.all([supportsWebP(), supportsAVIF()]).then(([webpSupported, avifSupported]) => {
            const images = document.querySelectorAll('img');
            
            images.forEach(img => {
                const src = img.src;
                
                // تحويل إلى تنسيق أفضل إذا كان متاحاً
                if (avifSupported && !src.includes('.avif')) {
                    const avifSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.avif');
                    
                    // التحقق من وجود النسخة AVIF
                    fetch(avifSrc, { method: 'HEAD' })
                        .then(response => {
                            if (response.ok) {
                                img.src = avifSrc;
                            }
                        })
                        .catch(() => {
                            // النسخة AVIF غير متاحة
                        });
                } else if (webpSupported && !src.includes('.webp')) {
                    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                    
                    // التحقق من وجود النسخة WebP
                    fetch(webpSrc, { method: 'HEAD' })
                        .then(response => {
                            if (response.ok) {
                                img.src = webpSrc;
                            }
                        })
                        .catch(() => {
                            // النسخة WebP غير متاحة
                        });
                }
            });
        });
    }

    // تحسين الصور المتجاوبة
    function implementResponsiveImages() {
        const images = document.querySelectorAll('img:not([srcset])');
        
        images.forEach(img => {
            const src = img.src;
            const width = img.offsetWidth;
            
            // إنشاء srcset للصور المتجاوبة
            if (src && !src.includes('data:')) {
                const baseSrc = src.replace(/\.(jpg|jpeg|png|webp)$/i, '');
                const extension = src.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.jpg';
                
                const srcset = [
                    `${baseSrc}_small${extension} 480w`,
                    `${baseSrc}_medium${extension} 768w`,
                    `${baseSrc}_large${extension} 1024w`,
                    `${src} 1200w`
                ].join(', ');
                
                img.setAttribute('srcset', srcset);
                img.setAttribute('sizes', '(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1200px');
            }
        });
    }

    // ضغط الصور في المتصفح
    function compressImages() {
        const fileInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
        
        fileInputs.forEach(input => {
            input.addEventListener('change', function(e) {
                const files = Array.from(e.target.files);
                
                files.forEach(file => {
                    if (file.type.startsWith('image/')) {
                        compressImage(file).then(compressedFile => {
                            // استبدال الملف الأصلي بالملف المضغوط
                            const dataTransfer = new DataTransfer();
                            dataTransfer.items.add(compressedFile);
                            input.files = dataTransfer.files;
                        });
                    }
                });
            });
        });
    }

    // دالة ضغط الصورة
    function compressImage(file, quality = 0.8, maxWidth = 1920, maxHeight = 1080) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = function() {
                // حساب الأبعاد الجديدة
                let { width, height } = img;
                
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // رسم الصورة المضغوطة
                ctx.drawImage(img, 0, 0, width, height);
                
                // تحويل إلى blob
                canvas.toBlob(resolve, file.type, quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }

    // تحسين الصور الخلفية
    function optimizeBackgroundImages() {
        const elements = document.querySelectorAll('[style*="background-image"]');
        
        elements.forEach(element => {
            const style = window.getComputedStyle(element);
            const backgroundImage = style.backgroundImage;
            
            if (backgroundImage && backgroundImage !== 'none') {
                // تحسين الصور الخلفية
                element.style.backgroundSize = 'cover';
                element.style.backgroundPosition = 'center';
                element.style.backgroundRepeat = 'no-repeat';
            }
        });
    }

    // مراقبة أداء الصور
    function monitorImagePerformance() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.initiatorType === 'img') {
                        const loadTime = entry.responseEnd - entry.startTime;
                        
                        if (loadTime > 1000) {
                            console.warn(`صورة بطيئة التحميل: ${entry.name} - ${loadTime}ms`);
                        }
                    }
                }
            });
            
            observer.observe({ entryTypes: ['resource'] });
        }
    }

    // تحسين الصور عند التحميل
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                optimizeImageSizes();
                implementProgressiveLoading();
                optimizeImageFormats();
                implementResponsiveImages();
                compressImages();
                optimizeBackgroundImages();
                monitorImagePerformance();
            });
        } else {
            optimizeImageSizes();
            implementProgressiveLoading();
            optimizeImageFormats();
            implementResponsiveImages();
            compressImages();
            optimizeBackgroundImages();
            monitorImagePerformance();
        }
    }

    // بدء التحسينات
    init();

})();

