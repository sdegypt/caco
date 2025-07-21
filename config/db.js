const mysql = require('mysql2');
const util = require('util');

// إنشاء مسبح اتصال بقاعدة البيانات
const db = mysql.createPool({
  host: '89.163.214.37',             // عنوان السيرفر (MaznHost)
  user: 'amlhabra_brak',             // اسم المستخدم
  password: 'hSgMaUAGjPdGa7ZfRM6T',  // كلمة المرور
  database: 'amlhabra_brak',         // اسم قاعدة البيانات
  port: 3306,                        // البورت الافتراضي لـ MySQL
  charset: 'utf8mb4',               // الترميز لدعم الرموز العربية والإيموجي
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000             // مهلة الاتصال
});

// اختبار الاتصال بقاعدة البيانات
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ لم يتم الاتصال بقاعدة البيانات:", err.message);
    console.error("تفاصيل الخطأ:", err);
    return;
  }
  console.log("✅ تم الاتصال بقاعدة البيانات بنجاح");
  connection.release(); // إعادة الاتصال للمسبح
});

// تحويل دوال الاستعلام إلى وعود (Promises)
db.query = util.promisify(db.query);

module.exports = db;
