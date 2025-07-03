---
title: "공지사항"
permalink: /contact/notice/
layout: single
pagination: false
---


<!-- 모든 공지사항을 숨겨서 페이지에 포함 -->
<div id="notice-data" style="display:none;">
  {% assign notices = site.categories.notice | sort: "date" | reverse %}
  {% assign total = notices | size %}
  {% for post in notices %}
    <div class="notice-item">
      <span class="number">{{ total | minus: forloop.index0 }}</span>
      <a href="{{ post.url }}">{{ post.title }}</a>
      <span class="date">{{ post.date | date: "%Y-%m-%d" }}</span>
    </div>
  {% endfor %}
</div>

<table class="notice-table">
  <thead>
    <tr>
      <th>번호</th>
      <th>제목</th>
      <th>작성일</th>
    </tr>
  </thead>
  <tbody id="notice-table-body">
    <tr><td colspan="3">공지사항을 준비하는 중...</td></tr>
  </tbody>
</table>

<div class="pagination" id="pagination"></div>
<script src="{{ '/assets/js/custom/notice-pagination.js' | relative_url }}"></script>
