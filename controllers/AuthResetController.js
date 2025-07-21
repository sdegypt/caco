const bcrypt = require('bcrypt');
const db = require('../config/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sedikdev@gmail.com',
    pass: 'nbckxvbnxqdsyvff'
  }
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = {
  // إرسال OTP
  async requestReset(req, res) {
    const { email } = req.body;
    try {
      const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (!user) {
        return res.status(200).json({ success: true, message: 'إذا كان البريد مسجلاً سيتم إرسال رمز التحقق.' });
      }
      const otp = generateOTP();
      const expires = new Date(Date.now() + 10 * 60 * 1000);
      await db.query('UPDATE users SET reset_otp = ?, reset_otp_expires = ? WHERE email = ?', [otp, expires, email]);
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'رمز استرجاع كلمة المرور',
        html: `
          <div style="direction:rtl;font-family:'Tajawal',Arial,sans-serif;background:#f8f9fa;padding:32px 0;">
            <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.07);padding:32px 24px 24px 24px;border:1px solid #eee;">
              <div style="text-align:center;margin-bottom:24px;"                <img src=\'https://www.amlhabrak.online/favicon/logo.png\' alt=\'اعملها براك\' style=\'width:80px;margin-bottom:8px;\'>             <h2 style="color:#FF6B00;font-weight:700;margin:0;font-size:1.5rem;">مرحبًا 👋</h2>
              </div>
              <p style="font-size:1.1rem;color:#222;margin-bottom:18px;">رمز التحقق الخاص بك هو:</p>
              <div style="font-size:2.2rem;font-weight:900;letter-spacing:6px;color:#6B48FF;background:#f8f9fa;padding:16px 0;border-radius:8px;margin-bottom:18px;border:1px dashed #FF6B00;">${otp}</div>
              <p style="font-size:1rem;color:#444;margin-bottom:12px;">الرجاء استخدام هذا الرمز لإتمام عملية التحقق.<br>هذا الرمز صالح لمدة <b>10 دقائق فقط</b>.</p>
              <p style="font-size:0.98rem;color:#888;margin-bottom:18px;">إذا لم تطلب هذا الرمز، يمكنك تجاهل هذه الرسالة بأمان.</p>
              <div style="border-top:1px solid #eee;margin:24px 0 12px 0;"></div>
              <p style="font-size:0.95rem;color:#888;margin-bottom:6px;">هذه رسالة آلية، لا ترد عليها.</p>
              <p style="font-size:0.95rem;color:#888;margin-bottom:6px;">لأي استفسار أو دعم فني، تواصل معنا عبر <a href='https://e3mlhabrak.com/contact' style='color:#6B48FF;text-decoration:none;'>صفحة التواصل</a> في الموقع.</p>
              <div style="margin-top:18px;text-align:center;">
                <span style="font-size:1rem;color:#FF6B00;font-weight:700;">مع تحياتنا،<br>فريق اعملها براك</span><br>
                <a href="https://www.amlhabrak.online" style="color:#6B48FF;font-size:0.95rem;text-decoration:none;">www.amlhabrak.online</a>
              </div>
            </div>
          </div>
        `
      });
      return res.json({ success: true, message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني.' });
    } catch (error) {
      console.error('خطأ في إرسال OTP:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ، حاول لاحقًا.' });
    }
  },

  // تحقق وتغيير كلمة المرور
  async resetPassword(req, res) {
    const { email, otp, newPassword } = req.body;
    try {
      const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      // طباعة القيم للتشخيص الكامل
      console.log('--- OTP RESET DEBUG ---');
      console.log('Email from user:', email);
      console.log('OTP from user:', otp);
      if (!user) {
        console.log('User not found for this email.');
      } else {
        console.log('OTP from db:', user.reset_otp);
        console.log('OTP expires from db:', user.reset_otp_expires);
      }
      if (!user || !user.reset_otp || !user.reset_otp_expires) {
        return res.status(400).json({ success: false, message: 'رمز التحقق غير صالح أو منتهي.' });
      }
      // مقارنة بدون مسافات أو حساسية حالة الأحرف
      const dbOtp = (user.reset_otp || '').toString().trim().toLowerCase();
      const userOtp = (otp || '').toString().trim().toLowerCase();
      console.log('Comparing:', dbOtp, 'vs', userOtp);
      if (dbOtp !== userOtp) {
        console.log('OTP does not match.');
        return res.status(400).json({ success: false, message: 'رمز التحقق غير صحيح.' });
      }
      if (new Date() > new Date(user.reset_otp_expires)) {
        console.log('OTP expired.');
        return res.status(400).json({ success: false, message: 'انتهت صلاحية رمز التحقق.' });
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        console.log('Password does not meet requirements.');
        return res.status(400).json({ success: false, message: 'كلمة المرور الجديدة لا تلبي متطلبات الأمان.' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.query('UPDATE users SET password = ?, reset_otp = NULL, reset_otp_expires = NULL WHERE email = ?', [hashedPassword, email]);
      console.log('Password reset successful.');
      return res.json({ success: true, message: 'تم إعادة تعيين كلمة المرور بنجاح.' });
    } catch (error) {
      console.error('خطأ في إعادة تعيين كلمة المرور:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ، حاول لاحقًا.' });
    }
  }
}; 