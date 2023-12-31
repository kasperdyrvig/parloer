---
layout: standard
metaTitle: Udvid dit grønlandske ordforråd
---
# Ordforråd

Udvid dit ordforråd med disse øvelser.

<div class="list-group nav-list-group">
{%- for vocabulary in collections.vocabulary %}
<a class="list-group-item" href="{{vocabulary.url | url}}">{{vocabulary.data.onPageTitle}}</a>
{%- endfor %}
</div>