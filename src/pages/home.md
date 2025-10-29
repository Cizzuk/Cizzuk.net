---
layout: "default"
lang: "en"
permalink: "/"
type: "home"
---
{% from 'appbox.njk' import appbox %}
{% from 'postbox.njk' import postbox %}

<div class="profbox" itemscope itemtype="http://schema.org/Person">
  <div class="proficon" aria-hidden data-svg="drpct">
    <noscript>
      <img src="{{ site.icons.proficon }}" alt itemprop="image">
    </noscript>
  </div>
  <h1 itemprop="name">{{ site.title }}</h1>
  <p itemprop="description">{{ site.bio }}</p>

  <ul>
    <li>
      <a href="https://github.com/Cizzuk" title="GitHub" aria-label="GitHub" data-svg="gh" rel="me" itemprop="sameAs">
        <noscript>
          <img src="/assets/home/icons/gh.png" alt="GitHub" class="dark-reverse">
        </noscript>
      </a>
    </li>
    <li>
      <a href="https://zenn.dev/cizzuk" title="Zenn" aria-label="Zenn" data-svg="zenn" rel="me" itemprop="sameAs">
        <noscript>
          <img src="/assets/home/icons/zenn.png" alt="Zenn">
        </noscript>
      </a>
    </li>
  </ul>
  <ul>
    <li>
      <a href="/contact/" title="Contact" aria-label="Contact" data-svg="mail" itemprop="email">
        <noscript>
          <img src="/assets/home/icons/mail.png" alt="Contact" class="dark-reverse">
        </noscript>
      </a>
    </li>
    <li>
      <a href="/tip/" title="Send a tip" aria-label="Send a tip" data-svg="heart">
        <noscript>
          <img src="/assets/home/icons/heart.png" alt="Send a tip" class="dark-reverse">
        </noscript>
      </a>
    </li>
  </ul>
</div>

{% if collections.projects | length > 0 %}
## [Projects](/projects/)
<section>
  {% for project in collections.projects | firstItems(3) %}
  {{ appbox(project.data.title,
    description=project.data.description,
    icon=project.data.icon,
    url=project.url) }}
  {% endfor %}
</section>
{% endif %}

{% if collections.posts | length > 0 %}
## [Posts](/posts/)
<section>
  {% for post in collections.posts | firstItems(3) %}
  {{ postbox(post, 'h2') }}
  {% endfor %}
</section>
{% endif %}

{% if collections.notes | length > 0 %}
## [Notes](/notes/)
<section>
  {% for post in collections.notes | firstItems(3) %}
  {{ postbox(post, "h3") }}
  {% endfor %}
</section>
{% endif %}
