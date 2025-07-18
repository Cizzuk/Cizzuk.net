---
layout: "default"
lang: "en"
collection: "app"
permalink: "/app/"
description: "List of my applications"
title: "Applications"
---
{% assign texts = site.data.texts %}
{% assign settings = site.data.settings %}

<section>
  {% assign apps = site.app | where_exp: "page", "page.hidden != true" %}
  {% for app in apps %}
  {% include appbox.html url=app.url title=app.title icon=app.icon description=app.description %}
  {% endfor %}
</section>

Other projects are available on [GitHub](https://github.com/Cizzuk?tab=repositories)
