---
title: "언론보도"
permalink: /media/news/
layout: single
pagination: false
---

{% assign news_posts = site.posts | where_exp: "post", "post.categories contains 'news'" | sort: 'date' | reverse %}

<div class="entries-list">
  {% for post in news_posts %}
    <a href="{{ post.url }}" class="news-item">
      <article>
        <div class="post-title">
          {{ post.title }}
        </div>
        <div class="post-excerpt">
          {{ post.excerpt | default: post.content | strip_html | truncatewords: 20 }}
        </div>
        <div class="post-date">
          <small>{{ post.date | date: "%Y-%m-%d" }}</small>
        </div>
      </article>
    </a>
  {% endfor %}
</div>







