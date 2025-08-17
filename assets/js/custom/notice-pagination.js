(() => {
  'use strict';

  const CONFIG = {
    ITEMS_PER_PAGE: 4,
    FADE_DURATION: 300,
    SELECTORS: {
      items: '#notice-data .notice-item',
      tableBody: '#notice-table-body',
      pagination: '#pagination',
      number: '.number',
      date: '.date'
    },
    CLASSES: {
      active: 'active',
      disabled: 'disabled'
    }
  };

  class NoticePagination {
    constructor() {
      this.elements = this.initElements();
      if (!this.validateElements()) return;
      
      this.items = Array.from(this.elements.items);
      this.totalItems = this.items.length;
      this.totalPages = Math.ceil(this.totalItems / CONFIG.ITEMS_PER_PAGE);
      this.currentPage = 1;
      
      this.init();
    }

    initElements() {
      return {
        items: document.querySelectorAll(CONFIG.SELECTORS.items),
        tableBody: document.getElementById('notice-table-body'),
        pagination: document.getElementById('pagination')
      };
    }

    validateElements() {
      const { items, tableBody, pagination } = this.elements;
      
      if (!items.length || !tableBody || !pagination) {
        console.warn('Required elements not found for notice pagination');
        return false;
      }
      
      return true;
    }

    init() {
      this.renderPage(1);
      this.renderPagination(1);
    }

    renderPage(page) {
      const { tableBody } = this.elements;
      
      this.fadeOut(tableBody, () => {
        this.clearTable();
        this.populateTable(page);
        this.fadeIn(tableBody);
      });
    }

    fadeOut(element, callback) {
      element.style.opacity = '0';
      setTimeout(callback, CONFIG.FADE_DURATION);
    }

    fadeIn(element) {
      element.style.opacity = '1';
    }

    clearTable() {
      this.elements.tableBody.innerHTML = '';
    }

    populateTable(page) {
      const startIndex = (page - 1) * CONFIG.ITEMS_PER_PAGE;
      const endIndex = Math.min(startIndex + CONFIG.ITEMS_PER_PAGE, this.totalItems);
      
      const fragment = document.createDocumentFragment();
      
      for (let i = startIndex; i < endIndex; i++) {
        fragment.appendChild(this.createTableRow(this.items[i]));
      }
      
      this.elements.tableBody.appendChild(fragment);
    }

    createTableRow(item) {
      const tr = document.createElement('tr');
      const number = item.querySelector(CONFIG.SELECTORS.number)?.textContent || '';
      const link = item.querySelector('a');
      const date = item.querySelector(CONFIG.SELECTORS.date)?.textContent || '';
      
      tr.innerHTML = `
        <td>${this.escapeHtml(number)}</td>
        <td>${link ? link.outerHTML : ''}</td>
        <td>${this.escapeHtml(date)}</td>
      `;
      
      return tr;
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    renderPagination(currentPage) {
      const { pagination } = this.elements;
      pagination.innerHTML = '';
      
      const fragment = document.createDocumentFragment();
      
      if (this.totalPages > 1) {
        fragment.appendChild(this.createPrevButton(currentPage));
      }
      
      for (let i = 1; i <= this.totalPages; i++) {
        fragment.appendChild(this.createPageButton(i, currentPage));
      }
      
      if (this.totalPages > 1) {
        fragment.appendChild(this.createNextButton(currentPage));
      }
      
      pagination.appendChild(fragment);
      this.currentPage = currentPage;
    }

    createPrevButton(currentPage) {
      const btn = this.createButton('‹', currentPage > 1);
      
      if (currentPage > 1) {
        btn.addEventListener('click', () => this.goToPage(currentPage - 1));
      }
      
      return btn;
    }

    createNextButton(currentPage) {
      const btn = this.createButton('›', currentPage < this.totalPages);
      
      if (currentPage < this.totalPages) {
        btn.addEventListener('click', () => this.goToPage(currentPage + 1));
      }
      
      return btn;
    }

    createPageButton(pageNum, currentPage) {
      const isActive = pageNum === currentPage;
      const btn = this.createButton(pageNum.toString(), !isActive);
      
      if (isActive) {
        btn.classList.add(CONFIG.CLASSES.active);
      } else {
        btn.addEventListener('click', () => this.goToPage(pageNum));
      }
      
      return btn;
    }

    createButton(text, enabled = true) {
      const btn = document.createElement('button');
      btn.textContent = text;
      btn.style.margin = '0 5px';
      btn.disabled = !enabled;
      btn.setAttribute('aria-label', `Page ${text}`);
      
      if (!enabled) {
        btn.classList.add(CONFIG.CLASSES.disabled);
      }
      
      return btn;
    }

    goToPage(page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage) {
        return;
      }
      
      this.renderPage(page);
      this.renderPagination(page);
    }
  }

  const initPagination = () => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => new NoticePagination());
    } else {
      new NoticePagination();
    }
  };

  initPagination();
})();