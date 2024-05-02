---
layout: standard
metaTitle: Videoer
---
# Videoer

Huskeregler, eksempler og illustrationer.

<div class="list-group nav-list-group">
{%- for video in collections.video %}
<a class="list-group-item" href="{{video.url | url}}">{{video.data.metaTitle}}</a>
{%- endfor %}
</div>