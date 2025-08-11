---
title: "공연 영상"
hide_title: true
permalink: /media/video/
layout: single
---
# 공연 영상
<section class="previous-performances-gallery">

  {% assign previous_posts = site.posts | concat: site.pages %}
  {% for post in previous_posts %}
    {% if post.tags contains "previous" %}
      {% if post.youtube and post.youtube.size > 0 %}
        {% assign has_media = true %}
      {% elsif post.video and post.video.size > 0 %}
        {% assign has_media = true %}
      {% else %}
        {% assign has_media = false %}
      {% endif %}
      {% if has_media %}
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
                  <div class="responsive-video">
                    <iframe
                      src="https://www.youtube.com/embed/{{ youtube_id }}"
                      title="YouTube video player"
                      frameborder="0"
                      allowfullscreen
                    ></iframe>
                  </div>
                </div>
              {% endif %}
            {% endfor %}
            {% for video in post.video %}
  {% assign v = video | strip %}
  {% if v != "" %}
    <div class="youtube-item">
      <div class="responsive-video">
        <video controls playsinline muted preload="auto">
  <source src="{{ v | relative_url }}" type="video/mp4">
</video>
      </div>
    </div>
  {% endif %}
{% endfor %}
          </div>
        </div>
      {% endif %}
    {% endif %}
  {% endfor %}
</section>
