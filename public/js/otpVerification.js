document.addEventListener('DOMContentLoaded', function() {
  const otpForm = document.getElementById('otpForm');
  const alertBox = document.getElementById('alertBox');
  if (otpForm) {
    otpForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
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
        alertBox.style.display = 'block';
        setTimeout(() => { window.location.href = '/login'; }, 2000);
      } else {
        alertBox.innerHTML = result.message || 'حدث خطأ.';
        alertBox.className = 'error';
        alertBox.style.display = 'block';
      }
    });
  }
}); 