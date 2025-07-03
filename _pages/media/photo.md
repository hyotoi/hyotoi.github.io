---
title: "공연 사진"
# hide_title: true
permalink: /media/photo/
layout: single
pagination: false
---

{% assign filtered_posts = site.posts | where:"categories","concert" | where_exp:"item","item.tags contains 'previous'" %}
{% assign sorted_posts = filtered_posts | sort:"date" | reverse %}

<section class="previous-performances-gallery">

  {% for post in sorted_posts %}
    <div class="performance-block">
      <h3 class="performance-title">
        <a href="{{ post.url }}">{{ post.title }}</a>
      </h3>
      <p class="performance-date">{{ post.date | date: "%Y년 %m월 %d일" }}</p>
      <div class="youtube-grid">
        {% assign slug = post.path | split: '/' | last | split: '.' | first %}
        {% for img in post.gallery %}
          <a href="{{ img.url }}" class="image-popup" data-mfp-gallery="{{ slug }}">
            <img src="{{ img.url }}" alt="{{ post.title }} 사진" class="gallery-image">
          </a>
        {% endfor %}
      </div>
    </div>
  {% endfor %}
</section>

