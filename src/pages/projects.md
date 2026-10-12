---
layout: "default"
lang: "en"
permalink: "/projects/"
title: "Projects"
description: "List of my projects"
---
{% from 'AppBox.njk' import AppBox %}

# {{ title }}

{% if collections.projects | length > 0 %}
<section>
  {% for project in collections.projects %}
  {{ AppBox(project, "h2") }}
  {% endfor %}
</section>
{% else %}
<strong>No projects here</strong>
{% endif %}

Other projects are available on [GitHub](https://github.com/Cizzuk).