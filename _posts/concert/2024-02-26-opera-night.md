---
layout: concert
title: "오페라의 밤"
date: 2024-02-26
location: 인천 예술회관
categories:
  - concert
tags:
  - previous

pagination:
  enabled: true
  per_page: 6
  collection: posts
  category: concert
  tag: previous
  sort_field: date
  sort_reverse: true

---

유명 오페라 아리아와 함께한 품격 있는 밤.

![opera](/assets/images/concert/2024-02-26-opera-night/poster.png)
{% if paginator %}
  <p class="pagination-category-info">
    <strong>Pagination category:</strong> {{ paginator.category | default: 'All posts' }}
  </p>
{% endif %}