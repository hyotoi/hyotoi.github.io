---
title: "공연 영상"
# hide_title: true
permalink: /media/video/
layout: single
---
<section class="previous-performances-gallery">

  {% assign previous_posts = site.posts | concat: site.pages %}
  {% for post in previous_posts %}
    {% if post.tags contains "previous" and post.youtube %}
      <div class="performance-block">
        <h3 class="performance-title">{{ post.title }}</h3>
        <div class="youtube-grid">
          {% for video in post.youtube %}
            {% assign youtube_id = nil %}
            {% if video contains "youtu.be/" %}
              {% assign youtube_id = video | split: "youtu.be/" | last | split: "?" | first %}
            {% elsif video contains "youtube.com/watch?v=" %}
              {% assign youtube_id = video | split: "v=" | last | split: "&" | first %}
            {% endif %}
            {% if youtube_id %}
              <div class="youtube-item">
                <iframe
                  src="https://www.youtube.com/embed/{{ youtube_id }}"
                  title="YouTube video player"
                  frameborder="0"
                  allowfullscreen
                ></iframe>
              </div>
            {% endif %}
          {% endfor %}
        </div>
      </div>
    {% endif %}
  {% endfor %}
</section>
