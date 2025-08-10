---
title: "단원 소개"
hide_title: true
permalink: /intro/members_profile/
layout: single
pagination: false
---

# 🎯 오케스트라 단원 소개

<div class="initial-content" id="members-container">
  {% assign members = site.data.members | sort: "order" %}

  <!-- 카드 그리드 -->
  <div class="member-grid" id="member-grid">
    {% for m in members %}
    <article class="member-card" tabindex="0" aria-haspopup="dialog">
      <div class="member-card__thumb">
        <img src="{{ m.image | relative_url }}" alt="{{ m.name }}" loading="lazy">
      </div>
      <div class="member-card__meta">
        <div class="member-card__name">{{ m.name }}</div>
        <div class="member-card__role">
          <span  class="member-card__instrument">{{ m.instrument | default: m.instruments }}</span >
          {% if m.role %}<span  class="member-card__position">({{ m.role }})</span >{% endif %}
        </div>
      </div>

      <!-- 패널로 주입될 숨김 상세 -->
      <div class="member-detail-content" hidden>
        <div class="member-detail__header">
          <img src="{{ m.image | relative_url }}" alt="{{ m.name }}">
          <div>
            <h3 id="member-panel-title">{{ m.name }}</h3>
            <p class="member-detail__sub">
              {{ m.instrument | default: m.instruments }}{% if m.role %} · {{ m.role }}{% endif %}
            </p>
          </div>
        </div>

        {% if m.education %}
        <div class="member-detail__section">
          <h4>학력</h4>
          <ul>{% for it in m.education %}<li>{{ it }}</li>{% endfor %}</ul>
        </div>
        {% endif %}

        {% if m.concours %}
        <div class="member-detail__section">
          <h4>수상 내역</h4>
          <ul>{% for it in m.concours %}<li>{{ it }}</li>{% endfor %}</ul>
        </div>
        {% endif %}

        {% if m.experience %}
        <div class="member-detail__section">
          <h4>경력</h4>
          <ul>{% for it in m.experience %}<li>{{ it }}</li>{% endfor %}</ul>
        </div>
        {% endif %}

        {% if m.current %}
        <div class="member-detail__section">
          <h4>현재</h4>
          <ul>{% for it in m.current %}<li>{{ it }}</li>{% endfor %}</ul>
        </div>
        {% endif %}
      </div>
    </article>
    {% endfor %}
  </div>

  <!-- 공용 패널 (뷰포트 고정: 데스크톱=중앙, 모바일=바텀시트) -->
  <div class="member-panel member-panel--incontainer" id="member-panel" aria-hidden="true" role="dialog" aria-modal="true">
    <div class="member-panel__overlay" data-close></div>
    <aside class="member-panel__sheet" tabindex="-1" aria-labelledby="member-panel-title">
      <button class="member-panel__close" type="button" aria-label="닫기" data-close>&times;</button>
      <div class="member-panel__body" id="member-panel-body"></div>
    </aside>
  </div>
</div>

<script>
(function(){
  const grid   = document.getElementById('member-grid');
  const panel  = document.getElementById('member-panel');
  const body   = document.getElementById('member-panel-body');
  let lastFocus = null;

  function openPanel(sourceEl){
    lastFocus = document.activeElement;
    body.innerHTML = sourceEl.innerHTML;
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden','false');
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('modal-open');
    setTimeout(()=> panel.querySelector('.member-panel__close')?.focus(),0);
    document.addEventListener('keydown', onKeydown);
  }
  function closePanel(){
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden','true');
    body.innerHTML = '';
    document.removeEventListener('keydown', onKeydown);
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('modal-open');
    if(lastFocus) lastFocus.focus();
  }
  function onKeydown(e){ if(e.key === 'Escape') closePanel(); }

  // 카드 클릭/키보드
  grid.addEventListener('click', (e)=>{
    const card = e.target.closest('.member-card'); if(!card) return;
    const content = card.querySelector('.member-detail-content'); if(!content) return;
    openPanel(content);
  });
  grid.addEventListener('keydown', (e)=>{
    if((e.key === 'Enter' || e.key === ' ') && e.target.closest('.member-card')){
      e.preventDefault();
      const card = e.target.closest('.member-card');
      const content = card.querySelector('.member-detail-content');
      if(content) openPanel(content);
    }
  });

  // 닫기 버튼/오버레이 클릭
  const onCloseTap = (e) => {
    const closer = e.target.closest('[data-close]');
    if (!closer) return;
    e.preventDefault();
    e.stopPropagation();
    closePanel();
  };
  panel.addEventListener('click', onCloseTap);
  panel.addEventListener('pointerup', onCloseTap);
  panel.addEventListener('touchend', onCloseTap, { passive: false });

  // ===== 모바일 스와이프-다운 닫기(엄격 조건) =====
  let startY=null, startX=null, startOnSheet=false, startInHeader=false, scrollTop0=0;
  let bodyScroller=null;

  panel.addEventListener('touchstart', (e)=>{
    if (!panel.classList.contains('is-open')) return;

    const sheet = e.target.closest('.member-panel__sheet');
    const overlay = e.target.closest('.member-panel__overlay');

    bodyScroller = panel.querySelector('.member-panel__body');

    if (overlay) {
      // 오버레이에서 시작: 그대로 허용(민감도는 아래에서 처리)
      startOnSheet = false;
    } else if (sheet) {
      startOnSheet = true;
      // 헤더 영역(타이틀/썸네일 부분)에서만 스와이프-닫기 허용
      startInHeader = !!e.target.closest('.member-detail__header');
      scrollTop0 = bodyScroller ? bodyScroller.scrollTop : 0;
    } else {
      startOnSheet = false;
      startInHeader = false;
    }
    startY = e.touches[0].clientY;
    startX = e.touches[0].clientX;
  }, {passive:true});

  panel.addEventListener('touchmove', (e)=>{
    if (startY == null) return;

    const dy = e.touches[0].clientY - startY;
    const dx = e.touches[0].clientX - startX;

    // 오버레이에서 스와이프: 80px 이상이면 닫기
    if (!startOnSheet) {
      if (dy > 80) { startY = null; closePanel(); }
      return;
    }

    // 시트 안에서: 헤더에서 시작 + 본문이 최상단일 때만 닫기 허용
    if (!startInHeader) return;
    if (bodyScroller && bodyScroller.scrollTop > 0) return;

    // 과도 반응 방지: 충분한 거리(140px) & 세로 위주 제스처일 때만
    const verticalEnough = dy > 140;
    const mostlyVertical = Math.abs(dx) <= 60;

    if (verticalEnough && mostlyVertical) {
      startY = null;
      e.preventDefault(); // iOS에서 잔여 스크롤 방지
      closePanel();
    }
  }, {passive:false});

  panel.addEventListener('touchend', ()=>{
    startY = startX = null;
    startOnSheet = startInHeader = false;
  });

})();
</script>
