---
title: "단원 소개"
hide_title: true
permalink: /intro/members_profile/
layout: single
pagination: false
author_profile: true
---

# 🎯 오케스트라 단원 소개

<!-- 악기별 필터 -->
<div class="instrument-filter" id="instrument-filter" role="navigation" aria-label="악기별 필터">
  {% assign sorted = site.data.members | sort: 'order' %}
  {% assign groups = sorted | group_by: 'instrument' %}
  {%- comment -%} 오케스트라 표준 악기 배치 순서: 현악기 → 목관악기 → 금관악기 → 타악기 → 기타 {%- endcomment -%}
  {%- assign desired_order = "Violin,Viola,Cello,Double Bass,Contrabass,Bass,Flute,Piccolo,Oboe,English Horn,Clarinet,Bass Clarinet,Bassoon,Contrabassoon,Horn,Trumpet,Trombone,Bass Trombone,Tuba,Timpani,Percussion,Xylophone,Marimba,Vibraphone,Glockenspiel,Piano,Harp,Organ,Celesta" | split: "," -%}
  {%- assign desired_order_lc = desired_order | join:"|" | downcase | split:"|" -%}
  {%- assign ordered_groups = "" | split:"|" -%}

  {%- comment -%} 원하는 순서대로 매칭 {%- endcomment -%}
  {%- for inst in desired_order -%}
    {%- assign inst_lc = inst | downcase -%}
    {%- for gg in groups -%}
      {%- assign gname_lc = gg.name | downcase -%}
      {%- if gname_lc == inst_lc -%}
        {%- assign ordered_groups = ordered_groups | push: gg -%}
        {%- break -%}
      {%- endif -%}
    {%- endfor -%}
  {%- endfor -%}

  {%- comment -%} 순서 목록에 없는 나머지 그룹 추가 {%- endcomment -%}
  {%- for g in groups -%}
    {%- assign gname_lc = g.name | downcase -%}
    {%- unless desired_order_lc contains gname_lc -%}
      {%- assign ordered_groups = ordered_groups | push: g -%}
    {%- endunless -%}
  {%- endfor -%}
  
  <ul class="instrument-filter__list" role="list">
    <li><button type="button" class="if-item is-active" data-target="all" aria-current="true">전체 단원 보기</button></li>
    {% for g in ordered_groups %}
      {% assign slug = g.name | slugify %}
      <li><button type="button" class="if-item" data-target="inst-{{ slug }}">{{ g.name }}</button></li>
    {% endfor %}
  </ul>
</div>

<!-- 멤버 섹션 -->
<div class="members-sections" id="members-sections">
  {% for g in ordered_groups %}
  {% assign sid = g.name | slugify %}
  <section class="instrument-section" aria-labelledby="title-{{ sid }}" data-section-id="inst-{{ sid }}">
    <h2 class="instrument-title" id="title-{{ sid }}">{{ g.name }}</h2>
    <div class="instrument-detail" data-detail-for="inst-{{ sid }}" hidden></div>

    <ul class="member-list" role="list">
      {%- comment -%} 역할 순서 정의 {%- endcomment -%}
      {%- assign role_order = "악장,수석,차석" | split: "," -%}
      
      {%- comment -%} 역할별로 정렬된 멤버 출력 {%- endcomment -%}
      {%- for role in role_order -%}
        {%- for m in g.items -%}
          {%- if m.role == role -%}
            {%- include member-row.html member=m section_id=sid index=forloop.index role_suffix=role -%}
          {%- endif -%}
        {%- endfor -%}
      {%- endfor -%}
      
      {%- comment -%} 일반 단원 출력 {%- endcomment -%}
      {%- for m in g.items -%}
        {%- unless role_order contains m.role -%}
          {%- include member-row.html member=m section_id=sid index=forloop.index role_suffix="others" -%}
        {%- endunless -%}
      {%- endfor -%}
    </ul>
  </section>
  {% endfor %}
</div>

<script src="{{ '/assets/js/custom/members-filter.js' | relative_url }}"></script>