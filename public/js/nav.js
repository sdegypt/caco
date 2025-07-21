document.addEventListener("DOMContentLoaded", function() {

  // فتح وإغلاق شريط التنقل 
  document.getElementById('navbar-toggle').addEventListener('click', function() {
    const navUl = document.querySelector('nav ul');
    if (navUl.style.display === "block") {
      navUl.style.display = "none";
    } else {
      navUl.style.display = "block";
    }
  });

  // تبديل القائمة الجانبية
  document.getElementById('navbar-toggle').addEventListener('click', function() {
    this.classList.toggle('active');
  });

  // إذا كان هناك قائمة منسدلة، قم بإضافة تبديل للقائمة الفرعية.
  const navLinks = document.querySelectorAll('nav ul li a:not(:only-child)');
  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const dropdown = this.nextElementSibling;
      if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
      } else {
        dropdown.style.display = "block";
        dropdown.style.zIndex = '1';
        document.querySelectorAll('.navbar-dropdown').forEach(function(dd) {
          if (dd !== dropdown) {
            dd.style.display = "none";
            dd.style.zIndex = '0';
          }
        });
      }
      e.stopPropagation();
    });
  });

  // النقر خارج القائمة المنسدلة سيزيل الفئة التابعة لها
  document.documentElement.addEventListener('click', function() {
    document.querySelectorAll('.navbar-dropdown').forEach(function(dropdown) {
      dropdown.style.display = "none";
    });
  });
});
