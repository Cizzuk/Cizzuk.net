---
layout: "default"
lang: "en"
permalink: "/notes/"
title: "Notes"
description: "List of my notes"
---
{% from 'postbox.njk' import postbox %}

# {{ title }}

Some articles are also available on [Zenn](https://zenn.dev/cizzuk)

{% if collections.notes | length > 0 %}
<section>
  {% for post in collections.notes %}
  {{ postbox(post.data, "h3") }}
  {% endfor %}
</section>
{% else %}
<strong>No notes available</strong>
{% endif %}