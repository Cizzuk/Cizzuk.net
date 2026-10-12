---
layout: "default"
lang: "ja"
permalink: "/notes/"
title: "Notes"
description: "Cizzukが書いたノートの一覧"
---
{% from 'PostBox.njk' import PostBox %}

# {{ title }}

ノートの一部は[Zenn](https://zenn.dev/cizzuk)でも公開しています。

{% if collections.notes | length > 0 %}
<section>
  {% for post in collections.notes %}
  {{ PostBox(post, "h3") }}
  {% endfor %}
</section>
{% else %}
<strong>ノートはありません</strong>
{% endif %}