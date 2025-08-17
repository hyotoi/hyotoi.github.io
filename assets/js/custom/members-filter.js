(() => {
  'use strict';

  const CONFIG = {
    SELECTORS: {
      filterWrap: 'instrument-filter',
      sections: '[data-section-id]',
      root: 'members-sections',
      filterItem: '.if-item',
      memberRow: '[data-accordion]',
      rowHead: '.row-head',
      rowBody: '.row-body',
      memberList: '.member-list',
      instrumentDetail: '.instrument-detail',
      instrumentSection: '.instrument-section'
    },
    CLASSES: {
      active: 'is-active',
      hidden: 'is-hidden'
    },
    ARIA: {
      current: 'aria-current',
      expanded: 'aria-expanded'
    }
  };

  class MembersFilter {
    constructor() {
      this.elements = this.initElements();
      if (!this.validateElements()) return;
      
      this.sections = [...this.elements.sections];
      this.init();
    }

    initElements() {
      return {
        filterWrap: document.getElementById(CONFIG.SELECTORS.filterWrap),
        sections: document.querySelectorAll(CONFIG.SELECTORS.sections),
        root: document.getElementById(CONFIG.SELECTORS.root)
      };
    }

    validateElements() {
      const { filterWrap, sections, root } = this.elements;
      
      if (!filterWrap || !sections.length || !root) {
        console.warn('Required elements not found for members filter');
        return false;
      }
      
      return true;
    }

    init() {
      this.bindEvents();
      this.applyHashOnLoad();
      window.addEventListener('hashchange', () => this.applyHashOnLoad());
    }

    bindEvents() {
      this.elements.filterWrap.addEventListener('click', (e) => this.handleFilterClick(e));
      this.elements.root.addEventListener('click', (e) => this.handleRowClick(e));
      this.elements.root.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
    }

    handleFilterClick(e) {
      const btn = e.target.closest(CONFIG.SELECTORS.filterItem);
      if (!btn) return;
      
      const targetId = btn.dataset.target;
      this.setActiveFilter(btn);
      this.showSection(targetId);
      this.updateHash(targetId);
    }

    setActiveFilter(btn) {
      this.elements.filterWrap.querySelectorAll(CONFIG.SELECTORS.filterItem).forEach(b => {
        const isActive = b === btn;
        b.classList.toggle(CONFIG.CLASSES.active, isActive);
        b.setAttribute(CONFIG.ARIA.current, isActive ? 'true' : 'false');
      });
    }

    showSection(id) {
      const showAll = (id === 'all');
      
      this.sections.forEach(section => {
        const shouldShow = showAll || section.dataset.sectionId === id;
        section.style.display = shouldShow ? '' : 'none';
      });
      
      if (!showAll) {
        const targetSection = this.sections.find(s => s.dataset.sectionId === id);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }

    updateHash(id) {
      if (id === 'all') {
        history.replaceState(null, '', location.pathname + location.search);
      } else {
        location.hash = id;
      }
    }

    applyHashOnLoad() {
      const hash = decodeURIComponent(location.hash.replace('#', ''));
      const btn = hash && this.elements.filterWrap.querySelector(`${CONFIG.SELECTORS.filterItem}[data-target="${hash}"]`);
      
      if (btn) {
        this.setActiveFilter(btn);
        this.showSection(hash);
      } else {
        const allBtn = this.elements.filterWrap.querySelector(`${CONFIG.SELECTORS.filterItem}[data-target="all"]`);
        if (allBtn) {
          this.setActiveFilter(allBtn);
          this.showSection('all');
        }
      }
    }

    handleRowClick(e) {
      const head = e.target.closest(CONFIG.SELECTORS.rowHead);
      if (!head) return;
      
      e.preventDefault();
      this.openDetailFromRow(head);
    }

    handleKeyNavigation(e) {
      const head = e.target.closest(CONFIG.SELECTORS.rowHead);
      if (!head) return;
      
      switch(e.key) {
        case ' ':
        case 'Spacebar':
        case 'Enter':
          e.preventDefault();
          this.openDetailFromRow(head);
          break;
          
        case 'ArrowDown':
        case 'ArrowUp':
          e.preventDefault();
          this.navigateRows(head, e.key === 'ArrowDown');
          break;
      }
    }

    navigateRows(currentHead, isDown) {
      const memberList = currentHead.closest(CONFIG.SELECTORS.memberList);
      if (!memberList) return;
      
      const visibleHeads = [...memberList.querySelectorAll(CONFIG.SELECTORS.rowHead)]
        .filter(h => !h.closest(CONFIG.SELECTORS.memberRow).classList.contains(CONFIG.CLASSES.hidden));
      
      const currentIndex = visibleHeads.indexOf(currentHead);
      const nextIndex = isDown ? currentIndex + 1 : currentIndex - 1;
      const nextHead = visibleHeads[nextIndex];
      
      if (nextHead) {
        nextHead.focus();
      }
    }

    openDetailFromRow(head) {
      const row = head.closest(CONFIG.SELECTORS.memberRow);
      const section = head.closest(CONFIG.SELECTORS.instrumentSection);
      const container = section.querySelector(CONFIG.SELECTORS.instrumentDetail);
      const body = row.querySelector(CONFIG.SELECTORS.rowBody);
      
      if (!row || !section || !container || !body) return;
      
      // Clear previous selections in the same section
      section.querySelectorAll(`.${CONFIG.CLASSES.hidden}`)
        .forEach(li => li.classList.remove(CONFIG.CLASSES.hidden));
      
      // Build and inject detail content
      container.innerHTML = this.buildDetailMarkup(head, body);
      container.hidden = false;
      
      // Hide selected row
      row.classList.add(CONFIG.CLASSES.hidden);
      
      // Bind close handler
      const closeBtn = container.querySelector('.detail-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          this.closeDetail(container, row, head);
        }, { once: true });
      }
      
      // Scroll to detail
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    closeDetail(container, row, head) {
      container.hidden = true;
      row.classList.remove(CONFIG.CLASSES.hidden);
      container.innerHTML = '';
      head.focus();
    }

    buildDetailMarkup(head, body) {
      const name = head.querySelector('.head-name')?.textContent?.trim() || '';
      const role = head.querySelector('.head-role')?.textContent?.trim() || '';
      const img = head.querySelector('.head-thumb')?.getAttribute('src') || '';
      
      const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      };
      
      return `
        <div class="detail-wrap">
          <div class="detail-left">
            <img src="${img}" alt="${escapeHtml(name)}" class="detail-photo"/>
            <div class="detail-meta">
              <h3 class="detail-name">${escapeHtml(name)}</h3>
              <p class="detail-role">${escapeHtml(role)}</p>
            </div>
          </div>
          <div class="detail-right">${body.innerHTML}</div>
          <button type="button" class="detail-close" aria-label="닫기">×</button>
        </div>`;
    }
  }

  // Initialize when DOM is ready
  const initMembersFilter = () => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => new MembersFilter());
    } else {
      new MembersFilter();
    }
  };

  initMembersFilter();
})();