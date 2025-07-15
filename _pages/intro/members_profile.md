---
title: "단원 소개"
permalink: /intro/members_profile/
layout: single
pagination: false
---

# 🎯 오케스트라 단원 소개

<!-- <link rel="stylesheet" href="{{ '/assets/css/members.css' | relative_url }}"> -->

<div class="member-gallery">
  {% for member in site.data.members %}
    <div class="member-card" onclick="togglePopup(this)">
      <div class="image-box">
        <img src="{{ member.image }}" alt="{{ member.name }}">
      </div>
      <div class="member-info">
        <div class="member-name">{{ member.name }}</div>
        <div class="member-instrument">{{ member.instrument | default: member.instruments }}</div>
        <div class="member-role">({{ member.role | default: "단원" }})</div>
      </div>

      <div class="popup">
        <span class="close" onclick="event.stopPropagation(); this.parentElement.classList.remove('show')">&times;</span>
        <div class="popup-name">{{ member.name }}</div>
        <div class="popup-instrument">({{ member.instrument | default: member.instruments }})</div>
        <div class="popup-role">{{ member.role | default: "단원" }}</div>

        {% if member.education %}
          <p class="popup-section-title">🎓 학력</p>
          {% for item in member.education %}
            <p class="popup-bio-line">- {{ item }}</p>
          {% endfor %}
        {% endif %}

        {% if member.concours %}
          <p class="popup-section-title">🏆 수상 내역</p>
          {% for item in member.concours %}
            <p class="popup-bio-line">- {{ item }}</p>
          {% endfor %}
        {% endif %}

        {% if member.experience %}
          <p class="popup-section-title">💼 경력</p>
          {% for item in member.experience %}
            <p class="popup-bio-line">- {{ item }}</p>
          {% endfor %}
        {% endif %}

        {% if member.current %}
          <p class="popup-section-title">🎵 현재 활동</p>
          {% for item in member.current %}
            <p class="popup-bio-line">- {{ item }}</p>
          {% endfor %}
        {% endif %}

      </div>
    </div>
  {% endfor %}
</div>

<script>
function togglePopup(cardElement) {
  document.querySelectorAll('.popup').forEach(p => p.classList.remove('show'));
  const popup = cardElement.querySelector('.popup');
  popup.classList.toggle('show');
  event.stopPropagation();
}

document.addEventListener('click', function(event) {
  const isCard = event.target.closest('.member-card');
  if (!isCard) {
    document.querySelectorAll('.popup').forEach(p => p.classList.remove('show'));
  }
});
</script>