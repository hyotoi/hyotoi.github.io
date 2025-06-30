---
title: "공연 사진"
permalink: /media/photo/
layout: single
pagination: false
---


{% assign filtered_posts = site.posts | where:"categories","concert" | where_exp:"item","item.tags contains 'previous'" %}
{% assign sorted_posts = filtered_posts | sort:"date" | reverse %}

{% for post in sorted_posts %}

  <section style="margin-bottom: 3rem;">
    <h2 style="margin-bottom: 0.5rem;"><a href="{{ post.url }}"> {{ post.title }} </a></h2>
    <p style="color: #666; margin-bottom: 1rem;">{{ post.date | date: "%Y년 %m월 %d일" }}</p>
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
      {% assign slug = post.path | split: '/' | last | split: '.' | first %}
      {% for img in post.gallery %}
        <a href="{{ img.url }}" class="image-popup" data-mfp-gallery="{{ slug }}">
          <img src="{{ img.url }}" alt="{{ post.title }} 사진" style="width: 200px; height: auto; border-radius: 8px;">
        </a>
      {% endfor %}
    </div>
  </section>
{% endfor %}

