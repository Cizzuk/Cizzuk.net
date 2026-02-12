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
  {{ appbox(project.data.title,
    description=project.data.description,
    icon=project.data.icon,
    url=project.url,
    heading="h2") }}
  {% endfor %}
</section>
{% else %}
<strong>No projects here</strong>
{% endif %}

Other projects are available on [GitHub](https://github.com/Cizzuk).