---
title: "단원 소개"
permalink: /intro/members_profile/
layout: single
pagination: false
---

# 🎯 오케스트라 단원 소개

<link rel="stylesheet" href="/_sass/members.css">

<div class="member-gallery">
  {% for member in site.data.members %}
    <div class="member-card" onclick="togglePopup(this)">
      <div class="image-box">
        <img src="{{ member.image }}" alt="{{ member.name }}">
      </div>
      <div class="member-info">
        <div class="member-name">{{ member.name }}</div>
        <div class="member-instrument">{{ member.instrument | default: member.instruments }}</div>
        <div class="member-role">({{ member.role }})</div>
      </div>

      <div class="popup">
        <span class="close" onclick="event.stopPropagation(); this.parentElement.classList.remove('show')">&times;</span>
        <div class="popup-name">{{ member.name }}</div>
        <div class="popup-instrument">({{ member.instrument | default: member.instruments }})</div>
        <div class="popup-role">{{ member.role }}</div>
        {% for line in member.bio %}
          <p class="popup-bio-line">- {{ line }}</p>
        {% endfor %}
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
