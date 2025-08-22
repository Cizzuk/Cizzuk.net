---
layout: "default"
lang: "en"
permalink: "/"
type: "home"
---
{% from 'appbox.njk' import appbox %}
{% from 'postbox.njk' import postbox %}

<div class="profbox">
  <div class="proficon" aria-hidden data-svg="drpct">
    <noscript>
      <img src="{{ site.icons.proficon }}" alt>
    </noscript>
  </div>
  <h1>{{ site.title }}</h1>
  <p>{{ site.bio }}</p>
  <p lang="ja">{{ site.bio_ja }}</p>

  <ul>
    <li>
      <a href="https://github.com/Cizzuk" aria-label="GitHub" data-svg="gh" title="GitHub" rel="me">
        <noscript>
          <img alt="GitHub" src="/assets/home/icons/gh.png" class="dark-reverse">
        </noscript>
      </a>
    </li>
    <li>
      <a href="https://zenn.dev/cizzuk" aria-label="Zenn" data-svg="zenn" title="Zenn" rel="me">
        <noscript>
          <img alt="Zenn" src="/assets/home/icons/zenn.png">
        </noscript>
      </a>
    </li>
  </ul>
  <ul>
    <li>
      <a href="/contact/" aria-label="Contact" data-svg="mail" title="Contact">
        <noscript>
          <img alt="Contact" src="/assets/home/icons/mail.png" class="dark-reverse">
        </noscript>
      </a>
    </li>
    <li>
      <a href="/tip/" aria-label="Send a tip" data-svg="heart" title="Send a tip">
        <noscript>
          <img alt="Send a tip" src="/assets/home/icons/heart.png" class="dark-reverse">
        </noscript>
      </a>
    </li>
  </ul>
</div>

{% if collections.projects | length > 0 %}
## [Projects](/projects/)
<section>
  {% for project in collections.projects | head(3) %}
  {{ appbox(project.data.stitle or project.data.title,
    description=project.data.description,
    icon=project.data.icon,
    url=project.url) }}
  {% endfor %}
</section>
{% endif %}

{% if collections.posts | length > 0 %}
## [Posts](/posts/)
<section>
  {% for post in collections.posts | head(3) %}
  {{ postbox(post, 'h2') }}
  {% endfor %}
</section>
{% endif %}

{% if collections.notes | length > 0 %}
## [Notes](/notes/)
<section>
  {% for post in collections.notes | head(3) %}
  {{ postbox(post, "h3") }}
  {% endfor %}
</section>
{% endif %}
