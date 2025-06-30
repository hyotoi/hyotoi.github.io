---
title: "공연 일정"
permalink: /concert/upcoming/
layout: single
pagination: false

---

<div class="content-grid">
  {% assign upcoming_posts = site.categories.concert | where_exp: "post", "post.tags contains 'upcoming'" | sort: "date" %}
  {% for post in upcoming_posts %}
    {% assign event_date = post.date | date: "%s" | plus: 0 %}
    {% assign now_date = "now" | date: "%s" | plus: 0 %}
    {% assign days_diff = event_date | minus: now_date | divided_by: 86400 %}
    <a class="content-card" href="{{ post.url | relative_url }}">
      {% assign img_parts = post.content | split: '<img' %}
      {% if img_parts.size > 1 %}
        {% assign src_split = img_parts[1] | split: 'src="' %}
        {% if src_split.size > 1 %}
          {% assign img_path_split = src_split[1] | split: '"' %}
          {% assign first_img_src = img_path_split[0] %}
          <div class="content-card__image">
            <img src="{{ first_img_src | relative_url }}" alt="{{ post.title }}">
          </div>
        {% endif %}
      {% endif %}
      <div class="content-card__badge">
        {% if days_diff < 0 %}
          <span class="badge past">PAST</span>
        {% else %}
          <span class="badge upcoming">UPCOMING D-{{ days_diff }}</span>
        {% endif %}
      </div>
      <div class="content-card__content">
        <div class="content-card__title">{{ post.title }}</div>
        <div class="content-card__date">{{ post.date | date: "%Y년 %m월 %d일" }}</div>
        <div class="content-card__location">{{ post.location }}</div>
      </div>
    </a>
  {% endfor %}
</div>
