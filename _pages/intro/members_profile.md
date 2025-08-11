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
    <div class="instrument-detail" data-detail-for="inst-{{ sid }}" hidden></div>

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

  // 아코디언(행 토글) → 섹션 하단 상세 박스 노출
  function buildDetailMarkup(head, body){
    const name = head.querySelector('.head-name')?.textContent?.trim() || '';
    const role = head.querySelector('.head-role')?.textContent?.trim() || '';
    const img  = head.querySelector('.head-thumb')?.getAttribute('src') || '';
    return `
      <div class="detail-wrap">
        <div class="detail-left">
          <img src="${img}" alt="${name}" class="detail-photo"/>
          <div class="detail-meta">
            <h3 class="detail-name">${name}</h3>
            <p class="detail-role">${role}</p>
          </div>
        </div>
        <div class="detail-right">${body.innerHTML}</div>
        <button type="button" class="detail-close" aria-label="닫기">×</button>
      </div>`;
  }

  function openDetailFromRow(head){
    const row = head.closest('[data-accordion]');
    const section = head.closest('.instrument-section');
    const container = section.querySelector('.instrument-detail');
    const body = row.querySelector('.row-body');

    // 이전 선택 해제: 같은 섹션 내에서 하나만
    section.querySelectorAll('.member-row.is-hidden').forEach(li=> li.classList.remove('is-hidden'));

    // 컨텐츠 주입
    container.innerHTML = buildDetailMarkup(head, body);
    container.hidden = false;

    // 선택된 항목은 리스트에서 숨김 처리
    row.classList.add('is-hidden');

    // 닫기 핸들러
    container.querySelector('.detail-close').addEventListener('click', ()=>{
      container.hidden = true;
      row.classList.remove('is-hidden');
      container.innerHTML = '';
      // 포커스 복귀
      head.focus();
    }, { once: true });

    // 상세로 스크롤
    container.scrollIntoView({behavior:'smooth', block:'start'});
  }

  root.addEventListener('click', (e)=>{
    const head = e.target.closest('.row-head');
    if(!head) return;
    e.preventDefault();
    openDetailFromRow(head);
  });

  // 키보드 접근성: Enter/Space 로 열기, ↑↓ 이동
  root.addEventListener('keydown', (e)=>{
    const head = e.target.closest('.row-head');
    if(!head) return;
    if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') { e.preventDefault(); openDetailFromRow(head); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const heads = [...head.closest('.member-list').querySelectorAll('.row-head')].filter(h=>!h.closest('.member-row').classList.contains('is-hidden'));
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
  width:100%;
  display:flex; flex-direction: column; align-items:center; justify-content:flex-start;
  gap:10px; padding:12px 12px 10px; background:#fff; border:0; cursor:pointer; text-align:center;
}
.row-head:focus-visible{ outline: none; box-shadow:0 0 0 3px #2a7ae2; border-radius:10px; }
.head-left{ display:flex; flex-direction: column; align-items:center; gap:10px; min-width:0; }
.head-thumb{ width:96px; height:128px; object-fit:cover; border-radius:10px; background:#f6f7f9; flex: 0 0 auto; }
.head-texts{ display:flex; flex-direction:column; align-items:center; text-align:center; min-width:0; }
.head-name{ font-size:.98rem; color:#111; line-height:1.25; word-break:keep-all; }
.head-role{ font-size:.78rem; color:#666; }
.head-icon{ display:none; }

/* 본문 */
.row-body{ padding: 12px; }
.detail-block{ margin:10px 0 0; }
.detail-block h4{ margin:0 0 6px; font-size:.9rem; color:#222; }
.detail-block ul{ margin:0; padding-left:18px; }
.detail-block li{ margin:.2rem 0; line-height:1.45; }

/* ------- 태블릿(>=768px) ------- */
@media (min-width: 768px){
  .row-head{ padding:14px 16px 12px; }
  .head-thumb{ width:112px; height:152px; }
  .head-name{ font-size:1rem; }
  .head-role{ font-size:.8rem; }
  .row-body{ padding: 14px 16px; }
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
  .row-head{ padding: 16px 16px 12px; border-bottom: 1px solid #f0f0f2; }
  .row-body{ padding: 14px; }
  .head-thumb{ width:128px; height:176px; }
}
@media (min-width: 1280px){
  .member-list{ grid-template-columns: repeat(3, minmax(0,1fr)); }   /* ✅ 3열 */
}
@media (min-width: 1536px){
  .member-list{ grid-template-columns: repeat(4, minmax(0,1fr)); }   /* ✅ 4열 */
}

/* ---------- 섹션 하단 상세 박스 ---------- */
.instrument-detail{ margin: 10px 0 22px; border:1px solid #e8e8ea; border-radius: 14px; background:#fff; box-shadow:0 6px 18px rgba(0,0,0,.06); padding: 14px; }
.detail-wrap{ display:grid; grid-template-columns: 220px 1fr; gap:16px; align-items:flex-start; }
.detail-photo{ width: 100%; height: auto; border-radius: 10px; object-fit: cover; background:#f6f7f9; }
.detail-meta{ margin-top: 10px; }
.detail-name{ margin:0 0 4px; font-size:1.25rem; }
.detail-role{ margin:0; color:#666; font-size:.95rem; }
.detail-right .detail-block{ margin-top: 0; }
.detail-close{ position:absolute; right:10px; top:10px; width:36px; height:36px; border:0; border-radius:10px; background:#f3f4f6; font-size:20px; cursor:pointer; }
.instrument-detail{ position: relative; }

/* 리스트에서 선택된 항목은 숨김 */
.member-row.is-hidden{ display:none !important; }

@media (max-width: 767px){
  .detail-wrap{ grid-template-columns: 1fr; }
  .detail-photo{ max-width: 220px; }
}

/* 모션 최소화 존중 */
@media (prefers-reduced-motion: reduce){
  .head-icon{ transition:none !important; }
}

/* === Image-first card style: no card background, image fills; text overlays === */

/* Remove list/card borders so images can be full-bleed */
.member-list{ border-top: 0 !important; }
.member-row{ border: 0 !important; background: transparent !important; border-radius: 12px; overflow: hidden; }

/* Make the card head behave like a block-level image card */
.row-head{
  display: block !important;
  padding: 0 !important;
  background: transparent !important;
  border: 0 !important;
  text-align: left !important;
  height: 100%;
}

/* Container for image + overlay */
.head-left{ position: relative !important; display: block !important; min-width: 0; height: 100%; }

/* Full-bleed image with fixed aspect ratio */
.head-thumb{
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
  display: block;
  border-radius: 12px;               /* rounded card corners */
  background: #f0f0f0;
  transition: transform .18s ease;
}

/* Subtle hover zoom on desktop */
@media (hover:hover){
  .row-head:hover .head-thumb{ transform: scale(1.02); }
}

/* Turn the text block into a bottom overlay */
.head-texts{
  position: absolute !important;
  left: 0; right: 0; bottom: 0;
  display: flex !important; flex-direction: column; align-items: flex-start !important;
  text-align: left !important; gap: 2px;
  padding: 12px 12px 10px;
  color: #fff;
  background: linear-gradient(to top, rgba(0,0,0,.58), rgba(0,0,0,.28) 38%, rgba(0,0,0,0) 72%);
  border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;
}
.head-name{ color:#fff !important; font-weight: 700; font-size: 1rem; margin: 0; text-shadow: 0 1px 2px rgba(0,0,0,.35); }
.head-role{ color:#eee !important; font-size: .86rem; margin: 0; text-shadow: 0 1px 2px rgba(0,0,0,.35); }

/* Make row-body padding independent of the image card above */
.row-body{ padding: 14px !important; }

/* Grid cards remain; card chrome is gone so increase gap a bit on desktop */
@media (min-width: 1024px){
  .member-list{ gap: 16px !important; }
}

/* Mobile fine-tuning */
@media (max-width: 767px){
  .head-name{ font-size: .98rem; }
  .head-role{ font-size: .8rem; }
}
</style>