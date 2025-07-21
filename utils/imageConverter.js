const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

class ImageConverter {
  constructor() {
    this.supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
    this.webpQuality = 80;
    this.maxWidth = 1920;
    this.maxHeight = 1080;
  }

  /**
   * تحويل صورة واحدة إلى WebP
   * @param {string} inputPath - مسار الصورة الأصلية
   * @param {string} outputPath - مسار الصورة المحولة (اختياري)
   * @param {object} options - خيارات التحويل
   * @returns {Promise<string>} - مسار الصورة المحولة
   */
  async convertToWebP(inputPath, outputPath = null, options = {}) {
    try {
      // التحقق من وجود الملف
      await fs.access(inputPath);
      
      // إنشاء مسار الإخراج إذا لم يتم تحديده
      if (!outputPath) {
        const parsedPath = path.parse(inputPath);
        outputPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);
      }

      // إعدادات التحويل
      const convertOptions = {
        quality: options.quality || this.webpQuality,
        effort: options.effort || 4,
        lossless: options.lossless || false
      };

      // تحويل الصورة
      let sharpInstance = sharp(inputPath);

      // تغيير حجم الصورة إذا كانت كبيرة جداً
      const metadata = await sharpInstance.metadata();
      if (metadata.width > this.maxWidth || metadata.height > this.maxHeight) {
        sharpInstance = sharpInstance.resize(this.maxWidth, this.maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // تحويل إلى WebP
      await sharpInstance
        .webp(convertOptions)
        .toFile(outputPath);

      console.log(`تم تحويل الصورة: ${inputPath} -> ${outputPath}`);
      return outputPath;

    } catch (error) {
      console.error(`خطأ في تحويل الصورة ${inputPath}:`, error.message);
      throw error;
    }
  }

  /**
   * تحويل جميع الصور في مجلد إلى WebP
   * @param {string} folderPath - مسار المجلد
   * @param {boolean} recursive - البحث في المجلدات الفرعية
   * @param {object} options - خيارات التحويل
   * @returns {Promise<Array>} - قائمة بالصور المحولة
   */
  async convertFolderToWebP(folderPath, recursive = true, options = {}) {
    const convertedFiles = [];

    try {
      const items = await fs.readdir(folderPath, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(folderPath, item.name);

        if (item.isDirectory() && recursive) {
          // معالجة المجلدات الفرعية
          const subFolderResults = await this.convertFolderToWebP(fullPath, recursive, options);
          convertedFiles.push(...subFolderResults);
        } else if (item.isFile()) {
          // معالجة الملفات
          const ext = path.extname(item.name).toLowerCase();
          
          if (this.supportedFormats.includes(ext)) {
            try {
              const webpPath = await this.convertToWebP(fullPath, null, options);
              convertedFiles.push({
                original: fullPath,
                webp: webpPath,
                success: true
              });
            } catch (error) {
              convertedFiles.push({
                original: fullPath,
                webp: null,
                success: false,
                error: error.message
              });
            }
          }
        }
      }

      return convertedFiles;

    } catch (error) {
      console.error(`خطأ في معالجة المجلد ${folderPath}:`, error.message);
      throw error;
    }
  }

  /**
   * إنشاء صورة مصغرة بصيغة WebP
   * @param {string} inputPath - مسار الصورة الأصلية
   * @param {string} outputPath - مسار الصورة المصغرة
   * @param {number} width - العرض المطلوب
   * @param {number} height - الارتفاع المطلوب
   * @returns {Promise<string>} - مسار الصورة المصغرة
   */
  async createThumbnail(inputPath, outputPath, width = 300, height = 300) {
    try {
      await sharp(inputPath)
        .resize(width, height, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 85 })
        .toFile(outputPath);

      console.log(`تم إنشاء صورة مصغرة: ${outputPath}`);
      return outputPath;

    } catch (error) {
      console.error(`خطأ في إنشاء الصورة المصغرة:`, error.message);
      throw error;
    }
  }

  /**
   * ضغط صورة WebP موجودة
   * @param {string} inputPath - مسار صورة WebP
   * @param {string} outputPath - مسار الصورة المضغوطة
   * @param {number} quality - جودة الضغط (1-100)
   * @returns {Promise<string>} - مسار الصورة المضغوطة
   */
  async compressWebP(inputPath, outputPath, quality = 70) {
    try {
      await sharp(inputPath)
        .webp({ quality })
        .toFile(outputPath);

      console.log(`تم ضغط صورة WebP: ${outputPath}`);
      return outputPath;

    } catch (error) {
      console.error(`خطأ في ضغط صورة WebP:`, error.message);
      throw error;
    }
  }

  /**
   * الحصول على معلومات الصورة
   * @param {string} imagePath - مسار الصورة
   * @returns {Promise<object>} - معلومات الصورة
   */
  async getImageInfo(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata();
      const stats = await fs.stat(imagePath);

      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: stats.size,
        sizeFormatted: this.formatFileSize(stats.size),
        channels: metadata.channels,
        hasAlpha: metadata.hasAlpha
      };

    } catch (error) {
      console.error(`خطأ في الحصول على معلومات الصورة:`, error.message);
      throw error;
    }
  }

  /**
   * تنسيق حجم الملف
   * @param {number} bytes - حجم الملف بالبايت
   * @returns {string} - حجم الملف منسق
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * مقارنة أحجام الملفات قبل وبعد التحويل
   * @param {string} originalPath - مسار الصورة الأصلية
   * @param {string} webpPath - مسار صورة WebP
   * @returns {Promise<object>} - نتائج المقارنة
   */
  async compareFileSizes(originalPath, webpPath) {
    try {
      const originalStats = await fs.stat(originalPath);
      const webpStats = await fs.stat(webpPath);
      
      const originalSize = originalStats.size;
      const webpSize = webpStats.size;
      const savings = originalSize - webpSize;
      const savingsPercentage = ((savings / originalSize) * 100).toFixed(2);

      return {
        original: {
          size: originalSize,
          formatted: this.formatFileSize(originalSize)
        },
        webp: {
          size: webpSize,
          formatted: this.formatFileSize(webpSize)
        },
        savings: {
          bytes: savings,
          formatted: this.formatFileSize(savings),
          percentage: savingsPercentage
        }
      };

    } catch (error) {
      console.error(`خطأ في مقارنة أحجام الملفات:`, error.message);
      throw error;
    }
  }

  /**
   * تحويل صورة مع إنشاء نسخ متعددة الأحجام
   * @param {string} inputPath - مسار الصورة الأصلية
   * @param {string} outputDir - مجلد الإخراج
   * @param {Array} sizes - قائمة بالأحجام المطلوبة
   * @returns {Promise<Array>} - قائمة بالصور المحولة
   */
  async createResponsiveImages(inputPath, outputDir, sizes = []) {
    const defaultSizes = [
      { width: 320, suffix: 'mobile' },
      { width: 768, suffix: 'tablet' },
      { width: 1200, suffix: 'desktop' },
      { width: 1920, suffix: 'large' }
    ];

    const targetSizes = sizes.length > 0 ? sizes : defaultSizes;
    const results = [];

    try {
      // إنشاء مجلد الإخراج إذا لم يكن موجوداً
      await fs.mkdir(outputDir, { recursive: true });

      const parsedPath = path.parse(inputPath);
      const baseName = parsedPath.name;

      for (const size of targetSizes) {
        const outputPath = path.join(outputDir, `${baseName}-${size.suffix}.webp`);
        
        await sharp(inputPath)
          .resize(size.width, null, {
            withoutEnlargement: true
          })
          .webp({ quality: this.webpQuality })
          .toFile(outputPath);

        results.push({
          size: size,
          path: outputPath
        });
      }

      console.log(`تم إنشاء ${results.length} صورة متجاوبة من ${inputPath}`);
      return results;

    } catch (error) {
      console.error(`خطأ في إنشاء الصور المتجاوبة:`, error.message);
      throw error;
    }
  }
}

module.exports = ImageConverter;

