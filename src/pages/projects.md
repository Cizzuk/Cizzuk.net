---
layout: "default"
lang: "en"
permalink: "/projects/"
title: "Projects"
description: "List of my projects"
---
{% from 'appbox.njk' import appbox %}

# {{ title }}

{% if collections.projects | length > 0 %}
<section>
  {% for project in collections.projects %}
  {{ appbox(project.data.stitle or project.data.title,
    description=project.data.description,
    icon=project.data.icon,
    url=project.url) }}
  {% endfor %}
</section>
{% else %}
<strong>No projects here</strong>
{% endif %}