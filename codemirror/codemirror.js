        // JavaScript لإدارة Pagination (التنقل بين الصفحات)
        let currentPage = 1;
        const itemsPerPage = 4;

        function displayDesigns() {
          const allDesigns = document.querySelectorAll('.output');
          allDesigns.forEach((design, index) => {
            design.style.display = (index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage) ? 'block' : 'none';
          });

          document.getElementById('prevPageBtn').disabled = currentPage === 1;
          document.getElementById('nextPageBtn').disabled = currentPage * itemsPerPage >= allDesigns.length;
        }

        document.getElementById('prevPageBtn').addEventListener('click', function() {
          if (currentPage > 1) {
            currentPage--;
            displayDesigns();
          }
        });

        document.getElementById('nextPageBtn').addEventListener('click', function() {
          const allDesigns = document.querySelectorAll('.output');
          if (currentPage * itemsPerPage < allDesigns.length) {
            currentPage++;
            displayDesigns();
          }
        });

        // عرض التصاميم الأولية
        displayDesigns();