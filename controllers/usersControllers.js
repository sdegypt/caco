require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const usersModels = require("../models/UsersModels");
const db = require("../config/db");

// إعدادات OAuth 2.0 مع بيانات الاعتماد من .env
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://www.amlhabrak.online/oauth2callback"
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

class UsersControllers {
  static findById(userId) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }
 static async signUpControllers(req, res) {
    try {

      const { name, age, gender, email, password, confirm_password } = req.body;

      // تحقق من تطابق كلمة المرور والتأكيد
      if (password !== confirm_password) {
        return res.render("signup", { errorMessage: "كلمتا المرور غير متطابقتين." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // طباعة البيانات قبل إرسالها إلى الموديل
   

      // إنشاء المستخدم
      const userId = await usersModels.createUser(
        name,
        age,
        gender,
        email,
        hashedPassword,
        '',       // country (افتراضي فارغ)
        'ar'      // language (افتراضي عربي)
      );

      const isJson = req.headers['content-type'] && req.headers['content-type'].includes('application/json');

      if (isJson) {
        return res.json({ success: true, message: "تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول." });
      }

      res.render("login", { successMessage: "تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول." });

    } catch (error) {

      const isJson = req.headers['content-type'] && req.headers['content-type'].includes('application/json');
      const msg = error.code === "ER_DUP_ENTRY"
        ? "البريد الإلكتروني مسجل بالفعل، الرجاء استخدام بريد آخر."
        : "حدث خطأ أثناء التسجيل، حاول مرة أخرى.";

      if (isJson) {
        return res.json({ success: false, message: msg });
      }

      res.render("signup", { errorMessage: msg });
    }
  }

  static async loginControllers(req, res) {
    try {
      const { email, password } = req.body;
      const user = await usersModels.loginModel(email);

      // تحديد إذا كان الطلب من fetch/ajax أو form عادي
      const isJson = req.headers['content-type'] && req.headers['content-type'].includes('application/json');

      if (!user) {
        if (isJson) {
          return res.json({ success: false, message: "هذا البريد الإلكتروني غير مسجل، الرجاء التسجيل أولاً." });
        } else {
          return res.render("login", { errorMessage: "هذا البريد الإلكتروني غير مسجل، الرجاء التسجيل أولاً." });
        }
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        if (isJson) {
          return res.json({ success: false, message: "كلمة المرور أو البريد الإلكتروني غير صحيح، حاول مرة أخرى." });
        } else {
          return res.render("login", { errorMessage: "كلمة المرور أو البريد الإلكتروني غير صحيح، حاول مرة أخرى." });
        }
      }

      const token = jwt.sign({ id: user.id }, "your_jwt_secret", { expiresIn: "30d" });
      res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 30 * 24 * 60 * 60 * 1000 });
      req.session.userId = user.id;
      if (isJson) {
        return res.json({ success: true, message: "تم تسجيل الدخول بنجاح" });
      } else {
        res.redirect("/profile");
      }
    } catch (error) {
      if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
        return res.json({ success: false, message: "حدث خطأ أثناء تسجيل الدخول، حاول مرة أخرى لاحقًا." });
      } else {
        res.render("login", { errorMessage: "حدث خطأ أثناء تسجيل الدخول، حاول مرة أخرى لاحقًا." });
      }
    }
  }

  static async logoutControllers(req, res) {
    try {
      res.clearCookie("token");
      res.redirect("/login");
    } catch (error) {
      res.status(500).render("profile", { errorMessage: "حدث خطأ أثناء تسجيل الخروج، حاول مرة أخرى.", successMessage: null });
    }
  }

  static async forgotPasswordControllers(req, res) {
    const { email } = req.body;
  
    try {
      const user = await usersModels.loginModel(email);
      if (!user) {
        return res.render("forgotPassword", { errorMessage: "البريد الإلكتروني غير مسجل لدينا، تحقق منه مرة أخرى." });
      }
  
      const token = jwt.sign({ id: user.id }, "your_jwt_secret", { expiresIn: "15m" });
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('OTP sent to user:', otp);
      await usersModels.saveOTP(user.id, otp);
  
      const accessToken = await oAuth2Client.getAccessToken();
      if (!accessToken.token) throw new Error("فشل الحصول على Access Token");
  
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL_USER,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
          accessToken: accessToken.token,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "إعادة تعيين كلمة المرور",
        text: `رمز OTP الخاص بك هو: ${otp}. استخدم هذا الرابط للتحقق: https://www.amlhabrak.online/verify-otp?token=${token}`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.render("forgotPassword", {
        successMessage: "تم إرسال رابط التحقق مع رمز OTP إلى بريدك الإلكتروني.",
      });
    } catch (error) {
      res.render("forgotPassword", {
        errorMessage: "مشكلة في الاتصال، تحقق من الشبكة أو حاول مرة أخرى.",
      });
    }
  }

  static async resetPasswordControllers(req, res) {
    const { token, newPassword } = req.body;

    try {
      const decoded = jwt.verify(token, "your_jwt_secret");
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await usersModels.updatePassword(decoded.id, hashedPassword);

      res.render("login", {
        successMessage: "تم إعادة تعيين كلمة المرور بنجاح، يمكنك تسجيل الدخول الآن.",
      });
    } catch (error) {
      res.render("resetPassword", {
        errorMessage: error.name === "TokenExpiredError" ? "انتهت صلاحية الرابط، اطلب رابطًا جديدًا." : "الرابط غير صالح أو منتهي الصلاحية، حاول مرة أخرى.",
        token,
      });
    }
  }

  static async updateProfileAjaxControllers(req, res) {
    try {
      const { name, age, gender, country, language, occupation, phone, portfolio } = req.body;
      const userId = req.user.id;

      await usersModels.updateUser(userId, name, null, age, gender, country, language, occupation, phone, portfolio);
      res.status(200).json({ message: "تم تحديث المعلومات بنجاح" });
    } catch (error) {
      res.status(500).json({ error: "حدث خطأ أثناء تحديث البيانات، حاول مرة أخرى." });
    }
  }
}

module.exports = UsersControllers;