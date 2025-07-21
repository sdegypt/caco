document.addEventListener("DOMContentLoaded", () => {
  const postInput = document.querySelector("input[name='content']");
  const hiddenForm = document.getElementById("hidden-form");
  const imagePreview = document.getElementById("image-preview");
  const imageInput = document.getElementById("postImages");
  const shareButton = document.querySelector(".share-btn");
  const cancelButton = document.querySelector(".cancel-btn");

  // إظهار الفورم المخفي عند الكتابة
  postInput.addEventListener("focus", () => {
    hiddenForm.classList.add("active");
  });

  // إخفاء الفورم عند الضغط على زر "إلغاء"
  cancelButton.addEventListener("click", () => {
    hiddenForm.classList.remove("active");
    imageInput.value = ""; // مسح المدخلات عند الإلغاء
    imagePreview.innerHTML = ""; // مسح المعاينة
    toggleShareButton(); // التحقق من تمكين زر المشاركة
  });

  // التحقق من تمكين زر المشاركة بناءً على النص والصور
  const toggleShareButton = () => {
    shareButton.disabled =
      !postInput.value.trim() && imageInput.files.length === 0;
  };

  // تحديث الصور عند تحميلها
  imageInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      alert("يمكنك رفع 4 صور فقط لكل منشور.");
      imageInput.value = ""; // تفريغ المدخل
      return;
    }

    imagePreview.innerHTML = ""; // تنظيف الصور السابقة
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = document.createElement("img");
        img.src = reader.result;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "×";
        removeBtn.classList.add("remove-image");
        removeBtn.onclick = () => {
          // حذف الصورة من المدخل
          const newFiles = Array.from(imageInput.files).filter(
            (_, i) => i !== index
          );
          const dataTransfer = new DataTransfer();
          newFiles.forEach((file) => dataTransfer.items.add(file));
          imageInput.files = dataTransfer.files;

          // تحديث المعاينة
          updatePreview(newFiles);
          toggleShareButton(); // التحقق من حالة الزر
        };

        const container = document.createElement("div");
        container.style.position = "relative";
        container.appendChild(img);
        container.appendChild(removeBtn);

        imagePreview.appendChild(container);
      };
      reader.readAsDataURL(file);
    });

    toggleShareButton(); // التحقق من حالة الزر
  });

  // تحديث المعاينة عند حذف الصور
  function updatePreview(files) {
    imagePreview.innerHTML = ""; // تنظيف الصور السابقة
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = document.createElement("img");
        img.src = reader.result;
        imagePreview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }

  // التحقق من حالة الزر عند كتابة النص
  postInput.addEventListener("input", toggleShareButton);
});
