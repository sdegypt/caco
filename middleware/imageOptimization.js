const ImageConverter = require('../utils/imageConverter');
const path = require('path');
const fs = require('fs').promises;

class ImageOptimizationMiddleware {
  constructor() {
    this.converter = new ImageConverter();
    this.cache = new Map();
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 ساعة
  }

  /**
   * Middleware لتحسين الصور تلقائياً
   */
  optimizeImages() {
    return async (req, res, next) => {
      // التحقق من وجود ملفات مرفوعة
      if (!req.files || Object.keys(req.files).length === 0) {
        return next();
      }

      try {
        const optimizedFiles = {};

        // معالجة كل ملف مرفوع
        for (const [fieldName, file] of Object.entries(req.files)) {
          if (this.isImageFile(file)) {
            const optimizedPath = await this.processUploadedImage(file);
            optimizedFiles[fieldName] = {
              ...file,
              optimizedPath,
              originalPath: file.path
            };
          } else {
            optimizedFiles[fieldName] = file;
          }
        }

        // استبدال الملفات بالنسخ المحسنة
        req.files = optimizedFiles;
        next();

      } catch (error) {
        console.error('خطأ في تحسين الصور:', error);
        next(); // المتابعة حتى لو فشل التحسين
      }
    };
  }

  /**
   * معالجة صورة مرفوعة
   * @param {object} file - ملف الصورة
   * @returns {Promise<string>} - مسار الصورة المحسنة
   */
  async processUploadedImage(file) {
    try {
      const originalPath = file.path;
      const parsedPath = path.parse(originalPath);
      const webpPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);

      // تحويل إلى WebP مع تحسين الحجم
      await this.converter.convertToWebP(originalPath, webpPath, {
        quality: 85,
        effort: 6
      });

      // إنشاء صورة مصغرة
      const thumbnailPath = path.join(parsedPath.dir, `${parsedPath.name}_thumb.webp`);
      await this.converter.createThumbnail(originalPath, thumbnailPath, 300, 300);

      // حفظ معلومات التحسين في الكاش
      const optimizationInfo = await this.converter.compareFileSizes(originalPath, webpPath);
      this.cache.set(webpPath, {
        ...optimizationInfo,
        timestamp: Date.now(),
        thumbnailPath
      });

      console.log(`تم تحسين الصورة: ${originalPath} -> ${webpPath}`);
      console.log(`توفير في الحجم: ${optimizationInfo.savings.percentage}%`);

      return webpPath;

    } catch (error) {
      console.error('خطأ في معالجة الصورة المرفوعة:', error);
      return file.path; // إرجاع المسار الأصلي في حالة الفشل
    }
  }

  /**
   * Middleware لخدمة الصور المحسنة
   */
  serveOptimizedImages() {
    return async (req, res, next) => {
      const imagePath = req.path;
      
      // التحقق من أن الطلب لصورة
      if (!this.isImagePath(imagePath)) {
        return next();
      }

      try {
        const webpPath = this.getWebPPath(imagePath);
        const supportsWebP = this.clientSupportsWebP(req);

        // إذا كان العميل يدعم WebP والملف موجود
        if (supportsWebP && await this.fileExists(webpPath)) {
          // تعيين headers مناسبة
          res.set({
            'Content-Type': 'image/webp',
            'Cache-Control': 'public, max-age=31536000', // سنة واحدة
            'Vary': 'Accept'
          });

          return res.sendFile(path.resolve(webpPath));
        }

        // خدمة الصورة الأصلية
        next();

      } catch (error) {
        console.error('خطأ في خدمة الصورة المحسنة:', error);
        next();
      }
    };
  }

  /**
   * تحسين صور موجودة في مجلد
   * @param {string} folderPath - مسار المجلد
   * @returns {Promise<object>} - نتائج التحسين
   */
  async optimizeExistingImages(folderPath) {
    try {
      console.log(`بدء تحسين الصور في: ${folderPath}`);
      
      const results = await this.converter.convertFolderToWebP(folderPath, true, {
        quality: 85,
        effort: 6
      });

      const summary = {
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        totalSavings: 0,
        errors: []
      };

      // حساب إجمالي التوفير
      for (const result of results) {
        if (result.success) {
          try {
            const comparison = await this.converter.compareFileSizes(
              result.original, 
              result.webp
            );
            summary.totalSavings += comparison.savings.bytes;
          } catch (error) {
            console.error('خطأ في حساب التوفير:', error);
          }
        } else {
          summary.errors.push({
            file: result.original,
            error: result.error
          });
        }
      }

      summary.totalSavingsFormatted = this.converter.formatFileSize(summary.totalSavings);

      console.log(`تم تحسين ${summary.successful} من ${summary.total} صورة`);
      console.log(`إجمالي التوفير: ${summary.totalSavingsFormatted}`);

      return summary;

    } catch (error) {
      console.error('خطأ في تحسين الصور الموجودة:', error);
      throw error;
    }
  }

  /**
   * تنظيف الكاش
   */
  cleanCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * التحقق من أن الملف صورة
   * @param {object} file - ملف الصورة
   * @returns {boolean}
   */
  isImageFile(file) {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
    return imageTypes.includes(file.mimetype);
  }

  /**
   * التحقق من أن المسار لصورة
   * @param {string} path - مسار الملف
   * @returns {boolean}
   */
  isImagePath(path) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const ext = path.toLowerCase().split('.').pop();
    return imageExtensions.includes(`.${ext}`);
  }

  /**
   * الحصول على مسار WebP للصورة
   * @param {string} imagePath - مسار الصورة الأصلية
   * @returns {string}
   */
  getWebPPath(imagePath) {
    const parsedPath = path.parse(imagePath);
    return path.join(parsedPath.dir, `${parsedPath.name}.webp`);
  }

  /**
   * التحقق من دعم العميل لـ WebP
   * @param {object} req - طلب HTTP
   * @returns {boolean}
   */
  clientSupportsWebP(req) {
    const accept = req.headers.accept || '';
    return accept.includes('image/webp');
  }

  /**
   * التحقق من وجود الملف
   * @param {string} filePath - مسار الملف
   * @returns {Promise<boolean>}
   */
  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * الحصول على إحصائيات التحسين
   * @returns {object}
   */
  getOptimizationStats() {
    const stats = {
      totalOptimized: this.cache.size,
      totalSavings: 0,
      averageSavings: 0
    };

    let totalSavingsBytes = 0;
    let totalSavingsPercentage = 0;

    for (const [, info] of this.cache.entries()) {
      totalSavingsBytes += info.savings.bytes;
      totalSavingsPercentage += parseFloat(info.savings.percentage);
    }

    stats.totalSavings = this.converter.formatFileSize(totalSavingsBytes);
    stats.averageSavings = this.cache.size > 0 ? 
      (totalSavingsPercentage / this.cache.size).toFixed(2) + '%' : '0%';

    return stats;
  }
}

module.exports = ImageOptimizationMiddleware;

