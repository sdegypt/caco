// التعامل مع تحميل الصورة عند النقر على الزر
document.querySelector('button[onclick]').addEventListener('click', function() {
    document.getElementById('imageUpload').click();
});

// التحقق من صحة البيانات قبل إرسال النموذج
document.querySelector('form').addEventListener('submit', function(event) {
    const urlField = document.querySelector('input[name="url"]');
    const titleField = document.querySelector('input[name="title"]');
    const imageField = document.getElementById('imageUpload');

    if (!urlField.value || !titleField.value) {
        alert('يرجى تعبئة جميع الحقول المطلوبة.');
        event.preventDefault();
        return;
    }

    if (imageField.files.length === 0) {
        alert('يرجى تحميل صورة للكارد.');
        event.preventDefault();
        return;
    }

    // إذا كان كل شيء صحيح، يسمح بإرسال النموذج
});

// تأكيد عملية الحذف
document.querySelectorAll('form[action^="/dashboard/delete"]').forEach(function(deleteForm) {
    deleteForm.addEventListener('submit', function(event) {
        if (!confirm('هل أنت متأكد من أنك تريد حذف هذا الكارد؟')) {
            event.preventDefault();
        }
    });
});

// يمكن إضافة أي وظائف إضافية حسب الحاجة هنا
