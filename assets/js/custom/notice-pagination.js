document.addEventListener('DOMContentLoaded', function() {
  const perPage = 4;
  const items = Array.from(document.querySelectorAll('#notice-data .notice-item'));
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const tableBody = document.getElementById('notice-table-body');
  const paginationDiv = document.getElementById('pagination');

  function renderPage(page) {
    tableBody.style.opacity = '0'; // 페이드 아웃
    setTimeout(() => {
      tableBody.innerHTML = '';
      const start = (page - 1) * perPage;
      const end = Math.min(start + perPage, totalItems);
      for (let i = start; i < end; i++) {
        const item = items[i];
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.querySelector('.number').textContent}</td>
          <td>${item.querySelector('a').outerHTML}</td>
          <td>${item.querySelector('.date').textContent}</td>
        `;
        tableBody.appendChild(tr);
      }
      tableBody.style.opacity = '1'; // 페이드 인
    }, 300);
  }

  function renderPagination(currentPage) {
    paginationDiv.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.style.margin = '0 5px';
      btn.disabled = (i === currentPage);
      btn.addEventListener('click', () => {
        renderPage(i);
        renderPagination(i);
      });
      paginationDiv.appendChild(btn);
    }
  }

  renderPage(1);
  renderPagination(1);
});
