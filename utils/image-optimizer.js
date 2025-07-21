const sharp = require("sharp");
const { glob } = require("glob"); // تصحيح الاستيراد
const fs = require("fs");
const path = require("path");

const inputFolder = "./public/uploads";
const outputFolder = "./public/uploads";

const optimizeImage = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath, ext);
  const dir = path.dirname(filePath);

  // تحديد مسار الإخراج
  const relativeDir = path.relative(inputFolder, dir);
  const outputDir = path.join(outputFolder, relativeDir);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPathWebP = path.join(outputDir, `${fileName}.webp`);
  const outputPathThumbnailWebP = path.join(outputDir, `${fileName}-thumbnail.webp`);

  try {
    // تحويل إلى WebP
    await sharp(filePath).webp({ quality: 80 }).toFile(outputPathWebP);
    console.log(`تم تحويل ${filePath} إلى WebP`);

    // إنشاء صورة مصغرة WebP
    await sharp(filePath).resize(200, 200, { fit: "inside" }).webp({ quality: 70 }).toFile(outputPathThumbnailWebP);
    console.log(`تم إنشاء صورة مصغرة WebP لـ ${filePath}`);

    // تحسين الصور الأصلية (JPG, PNG) إذا لم تكن WebP
    if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
      const outputPathOriginal = path.join(outputDir, `${fileName}${ext}`);
      await sharp(filePath).toFile(outputPathOriginal);
      console.log(`تم تحسين الصورة الأصلية لـ ${filePath}`);
    }
  } catch (error) {
    console.error(`خطأ في معالجة الصورة ${filePath}:`, error);
  }
};

const processImages = () => {
  const imageExtensions = "{jpg,jpeg,png}";
  const pattern = `${inputFolder}/**/*${imageExtensions}`;

  glob(pattern, async (err, files) => {
    if (err) {
      console.error("خطأ في قراءة الملفات:", err);
      return;
    }

    for (const file of files) {
      await optimizeImage(file);
    }
    console.log("اكتملت معالجة جميع الصور.");
  });
};

processImages();


