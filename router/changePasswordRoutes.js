const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// عرض صفحة تغيير كلمة المرور
router.get('/change-password', authMiddleware, (req, res) => {
    res.render('changePassword', {
        userId: req.session.userId,
        isAdmin: res.locals.isAdmin,
        unreadCount: res.locals.unreadCount
    });
});

// تغيير كلمة المرور (المستخدم يجب أن يكون مسجلاً دخوله)
router.post('/change-password', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // تحقق من تسجيل الدخول
        if (!userId) {
            return res.status(401).json({ success: false, message: 'يجب تسجيل الدخول أولاً.' });
        }

        // تحقق من تطابق كلمتي المرور الجديدتين
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'كلمة المرور الجديدة وتأكيدها غير متطابقين.' });
        }

        // تحقق من قوة كلمة المرور الجديدة (اختياري)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ success: false, message: 'كلمة المرور الجديدة لا تلبي متطلبات الأمان.' });
        }

        console.log('userId في الجلسة:', userId);
        const [row] = await db.query('SELECT password FROM users WHERE id = ?', [userId]);
        console.log('نتيجة الاستعلام:', row);
        if (!row || !row.password) {
            return res.status(404).json({ success: false, message: 'المستخدم غير موجود.' });
        }

        // تحقق من صحة كلمة المرور الحالية
        const isMatch = await bcrypt.compare(currentPassword, row.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'كلمة المرور الحالية غير صحيحة.' });
        }

        // تشفير كلمة المرور الجديدة
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // تحديث كلمة المرور في قاعدة البيانات
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

        return res.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح.' });
    } catch (error) {
        console.error('خطأ في تغيير كلمة المرور:', error);
        return res.status(500).json({ success: false, message: 'حدث خطأ أثناء تغيير كلمة المرور. حاول لاحقًا.' });
    }
});

module.exports = router;
