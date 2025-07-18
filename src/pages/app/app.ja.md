---
layout: "default"
lang: "ja"
collection: "app"
permalink: "/app/"
description: "アプリの一覧"
title: "アプリ"
---
{% assign texts = site.data.texts %}
{% assign settings = site.data.settings %}

<section>
  {% assign apps = site.app | where_exp: "page", "page.hidden != true" %}
  {% for app in apps %}
  {% include appbox.html url=app.url title=app.title icon=app.icon description=app.description %}
  {% endfor %}
</section>

そのほかのプロジェクトは[GitHub](https://github.com/Cizzuk?tab=repositories)にあります
