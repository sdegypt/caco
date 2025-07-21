const forgotForm = document.getElementById('forgotPasswordForm');
const otpSection = document.getElementById('otpSection');
const alertBox = document.getElementById('alertBox');

if (forgotForm) {
  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const response = await fetch('/auth/request-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const result = await response.json();
    if (result.success) {
      alertBox.innerHTML = 'تم إرسال رمز التحقق إلى بريدك الإلكتروني.';
      alertBox.className = 'success';
      otpSection.style.display = 'block';
      document.getElementById('otpEmail').value = email;
    } else {
      alertBox.innerHTML = result.message || 'حدث خطأ.';
      alertBox.className = 'error';
    }
    alertBox.style.display = 'block';
  });
}

const otpForm = document.getElementById('otpForm');
if (otpForm) {
  otpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('otpEmail').value;
    const otp = document.getElementById('otp').value;
    const newPassword = document.getElementById('newPassword').value;
    const response = await fetch('/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword })
    });
    const result = await response.json();
    if (result.success) {
      alertBox.innerHTML = 'تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.';
      alertBox.className = 'success';
      setTimeout(() => { window.location.href = '/login'; }, 2000);
    } else {
      alertBox.innerHTML = result.message || 'حدث خطأ.';
      alertBox.className = 'error';
    }
    alertBox.style.display = 'block';
  });
}