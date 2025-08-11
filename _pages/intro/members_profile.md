---
title: "단원 소개"
hide_title: true
permalink: /intro/members_profile/
layout: single
pagination: false
author_profile: true
# classes: wide
---

# 🎯 오케스트라 단원 소개

<!-- ▷ 상단: 악기별 필터 -->
<div class="instrument-filter" id="instrument-filter" role="navigation" aria-label="악기별 필터">
  {% assign sorted = site.data.members | sort: 'order' %}
  {% assign groups = sorted | group_by: 'instrument' %}
  <ul class="instrument-filter__list" role="list">
    <li><button type="button" class="if-item is-active" data-target="all" aria-current="true">전체 단원 보기</button></li>
    {% for g in groups %}
      {% assign slug = g.name | slugify %}
      <li><button type="button" class="if-item" data-target="inst-{{ slug }}">{{ g.name }}</button></li>
    {% endfor %}
  </ul>
</div>

<!-- ▷ 본문: 악기별 섹션/리스트형 뷰 -->
<div class="members-sections" id="members-sections">
  {% for g in groups %}
  {% assign sid = g.name | slugify %}
  <section class="instrument-section" aria-labelledby="title-{{ sid }}" data-section-id="inst-{{ sid }}">
    <h2 class="instrument-title" id="title-{{ sid }}">{{ g.name }}</h2>

    <ul class="member-list" role="list">
      {% for m in g.items %}
      <li class="member-row" data-accordion>
        <button class="row-head"
                type="button"
                aria-expanded="false"
                aria-controls="row-{{ sid }}-{{ forloop.index }}"
                id="head-{{ sid }}-{{ forloop.index }}">
          <span class="head-left">
            <img class="head-thumb" src="{{ m.image | relative_url }}" alt="{{ m.name }}" loading="lazy">
            <span class="head-texts">
              <strong class="head-name">{{ m.name }}</strong>
              <span class="head-role">{% if m.role %}{{ m.role }}{% else %}단원{% endif %}</span>
            </span>
          </span>
          <span class="head-icon" aria-hidden="true">▾</span>
        </button>

        <div class="row-body"
             id="row-{{ sid }}-{{ forloop.index }}"
             role="region"
             aria-labelledby="head-{{ sid }}-{{ forloop.index }}"
             hidden>
          {% if m.education %}
          <div class="detail-block">
            <h4>학력</h4>
            <ul>{% for it in m.education %}<li>{{ it }}</li>{% endfor %}</ul>
          </div>
          {% endif %}

          {% if m.concours %}
          <div class="detail-block">
            <h4>수상 내역</h4>
            <ul>{% for it in m.concours %}<li>{{ it }}</li>{% endfor %}</ul>
          </div>
          {% endif %}

          {% if m.experience %}
          <div class="detail-block">
            <h4>경력</h4>
            <ul>{% for it in m.experience %}<li>{{ it }}</li>{% endfor %}</ul>
          </div>
          {% endif %}

          {% if m.current %}
          <div class="detail-block">
            <h4>현재</h4>
            <ul>{% for it in m.current %}<li>{{ it }}</li>{% endfor %}</ul>
          </div>
          {% endif %}
        </div>
      </li>
      {% endfor %}
    </ul>
  </section>
  {% endfor %}
</div>

<!-- ========== JS: 필터/아코디언/해시 연동 ========== -->
<script>
(function(){
  const filterWrap = document.getElementById('instrument-filter');
  const sections   = [...document.querySelectorAll('[data-section-id]')];
  const root       = document.getElementById('members-sections');

  function setActiveFilter(btn){
    filterWrap.querySelectorAll('.if-item').forEach(b=>{
      b.classList.toggle('is-active', b === btn);
      b.removeAttribute('aria-current');
    });
    btn.setAttribute('aria-current','true');
  }

  function showSection(id){
    const all = (id === 'all');
    sections.forEach(sec=>{
      const show = all || sec.dataset.sectionId === id;
      sec.style.display = show ? '' : 'none';
    });
    if (!all){
      const target = sections.find(s => s.dataset.sectionId === id);
      if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  }

  // 필터 클릭
  filterWrap.addEventListener('click', (e)=>{
    const btn = e.target.closest('.if-item');
    if(!btn) return;
    const id = btn.dataset.target;
    setActiveFilter(btn);
    showSection(id);
    if (id === 'all') history.replaceState(null,'',location.pathname+location.search);
    else location.hash = id;
  });

  // 해시 → 초기 상태 반영
  function applyHashOnLoad(){
    const hash = decodeURIComponent(location.hash.replace('#',''));
    const btn  = hash && filterWrap.querySelector(`.if-item[data-target="${hash}"]`);
    if (btn){
      setActiveFilter(btn);
      showSection(hash);
    }else{
      const allBtn = filterWrap.querySelector('.if-item[data-target="all"]');
      setActiveFilter(allBtn);
      showSection('all');
    }
  }
  window.addEventListener('hashchange', applyHashOnLoad);
  applyHashOnLoad();

  // 아코디언(행 토글)
  function toggleRow(head){
    const row  = head.closest('[data-accordion]');
    const body = row.querySelector('.row-body');
    const isOpen = head.getAttribute('aria-expanded') === 'true';
    head.setAttribute('aria-expanded', String(!isOpen));
    body.hidden = isOpen;
    if (!isOpen && matchMedia('(max-width: 1023px)').matches) {
      body.scrollIntoView({behavior:'smooth', block:'nearest'});
    }
  }
  root.addEventListener('click', (e)=>{
    const head = e.target.closest('.row-head');
    if(!head) return;
    toggleRow(head);
  });
  root.addEventListener('keydown', (e)=>{
    const head = e.target.closest('.row-head');
    if(!head) return;
    if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') { e.preventDefault(); toggleRow(head); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const heads = [...head.closest('.member-list').querySelectorAll('.row-head')];
      const idx = heads.indexOf(head);
      const next = (e.key === 'ArrowDown') ? heads[idx+1] : heads[idx-1];
      next?.focus();
    }
  });
})();
</script>

<!-- ========== CSS (페이지 내 포함) ========== -->
<style>
/* ===== 페이지 폭 확장: 데스크톱에서 여백까지 활용 (좌측 여백까지 사용) ===== */
:root{ --page-max: 1600px; --page-max-xl: 1760px; }

/* 페이지 본문 폭을 넓히고 좌우 패딩을 줄여서 여백 활용 */
.layout--single .page__content { width: 100%; padding-left: 12px; padding-right: 12px; }
.layout--single.wide .page__content { max-width: var(--page-max); }

/* 상단 필터/섹션 컨테이너도 같은 폭으로 중앙 정렬 */
.instrument-filter,
.members-sections { max-width: var(--page-max); margin-inline: auto; }

/* 초대형 화면에서 더 넓게 */
@media (min-width: 1800px){
  .layout--single.wide .page__content,
  .instrument-filter,
  .members-sections { max-width: var(--page-max-xl); }
}

/* ---------- 상단 악기 필터 ---------- */
.instrument-filter{ margin: 8px 0 16px; }
.instrument-filter__list{
  list-style:none; margin:0; padding:12px; border:1px solid #e6e6ef; border-radius:12px;
  display:flex; flex-wrap:wrap; gap:8px 12px; align-items:center;
  border-bottom:3px solid #5a3bf0;
  background:#fff;
}
.if-item{
  display:inline-block; line-height:1; padding:10px 12px; border-radius:999px; border:1px solid #dfe1e6;
  background:#fff; color:#333; font-size:.92rem; cursor:pointer;
}
.if-item:hover{ background:#f7f8fb; }
.if-item.is-active{ border-color:#5a3bf0; color:#5a3bf0; font-weight:700; }
@media (min-width: 1280px){
  .instrument-filter__list{ padding:14px 16px; gap:10px 14px; }
  .if-item{ font-size:.95rem; }
}

/* ---------- 리스트/섹션(모바일 우선) ---------- */
.members-sections{ display:block; }
.instrument-section{ margin: 18px 0 28px; }
.instrument-title{
  font-size:1.15rem; margin: 0 0 10px;
  border-left: 4px solid #2a7ae2; padding-left: 10px;
}

.member-list{ list-style:none; margin:0; padding:0; border-top:1px solid #eee; }
.member-row{ border-bottom:1px solid #eee; }

/* 헤더 버튼(터치 타겟 44px 이상) */
.row-head{
  width:100%; min-height: 52px;
  display:flex; align-items:center; justify-content:space-between;
  gap:10px; padding:12px; background:#fff; border:0; cursor:pointer; text-align:left;
}
.row-head:focus-visible{ outline: none; box-shadow:0 0 0 3px #2a7ae2; border-radius:10px; }
.head-left{ display:flex; align-items:center; gap:12px; min-width:0; }
.head-thumb{ width:52px; height:70px; object-fit:cover; border-radius:8px; background:#f6f7f9; flex: 0 0 auto; }
.head-texts{ display:flex; flex-direction:column; min-width:0; }
.head-name{ font-size:.98rem; color:#111; line-height:1.25; word-break:keep-all; }
.head-role{ font-size:.78rem; color:#666; }
.head-icon{ flex: 0 0 auto; opacity:.6; transform: rotate(0deg); transition: transform .15s ease; }
.row-head[aria-expanded="true"] .head-icon{ transform: rotate(180deg); }

/* 본문 */
.row-body{ padding: 0 12px 12px 76px; }
.detail-block{ margin:10px 0 0; }
.detail-block h4{ margin:0 0 6px; font-size:.9rem; color:#222; }
.detail-block ul{ margin:0; padding-left:18px; }
.detail-block li{ margin:.2rem 0; line-height:1.45; }

/* ------- 태블릿(>=768px) ------- */
@media (min-width: 768px){
  .row-head{ padding:14px 16px; min-height: 56px; }
  .head-thumb{ width:60px; height:80px; }
  .head-name{ font-size:1rem; }
  .head-role{ font-size:.8rem; }
  .row-body{ padding: 0 16px 14px 96px; }
}

/* ------- 데스크톱(>=1024px) ------- */
/* 2열 → 대형 해상도에서 3, 초대형에서 4열까지 확장 */
@media (min-width: 1024px){
  .member-list{
    display: grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 14px;
    border-top: 0;
  }
  .member-row{
    border: 1px solid #e8e8ea; border-radius: 12px; overflow: hidden; background: #fff;
  }
  .row-head{ padding: 14px; min-height: 60px; border-bottom: 1px solid #f0f0f2; }
  .row-body{ padding: 12px 14px 14px 90px; }
  .head-thumb{ width:64px; height:86px; }
}
@media (min-width: 1280px){
  .member-list{ grid-template-columns: repeat(3, minmax(0,1fr)); }   /* ✅ 3열 */
}
@media (min-width: 1536px){
  .member-list{ grid-template-columns: repeat(4, minmax(0,1fr)); }   /* ✅ 4열 */
}

@media (min-width: 1800px){
  .member-list{ grid-template-columns: repeat(5, minmax(0,1fr)); }
}

/* 모션 최소화 존중 */
@media (prefers-reduced-motion: reduce){
  .head-icon{ transition:none !important; }
}
</style>