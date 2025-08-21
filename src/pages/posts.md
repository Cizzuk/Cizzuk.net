---
layout: "default"
lang: "en"
permalink: "/posts/"
title: "Posts"
description: "Posts of app updates, announcements, etc."
---
{% from 'postbox.njk' import postbox %}

# {{ title }}

{% if collections.posts | length > 0 %}
<section>
  {% for post in collections.posts %}
  {{ postbox(post.data, 'h2') }}
  {% endfor %}
</section>
{% else %}
<strong>No posts available</strong>
{% endif %}