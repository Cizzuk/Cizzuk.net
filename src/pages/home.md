---
layout: "default"
lang: "en"
permalink: "/"
type: "home"
scripts:
  - src: "/assets/home/js/home.js"
    defer: true
---
{% from 'AppBox.njk' import AppBox %}
{% from 'PostBox.njk' import PostBox %}

<div class="profbox" itemscope itemtype="http://schema.org/Person">
  <div class="drpct" aria-hidden data-svg="drpct">
    <noscript>
      <img src="{{ site.icons.proficon }}" alt itemprop="image">
    </noscript>
  </div>
  
  <div class="profinfo">
    <h1 itemprop="name">{{ site.title }}</h1>
    <p itemprop="description">{{ site.bio }}</p>
    <ul>
      <li>
        <a href="{{ site.links.github }}" title="GitHub" aria-label="GitHub" data-svg="gh" rel="me" itemprop="sameAs">
          <noscript>
            <img src="/assets/home/icons/gh.png" alt="GitHub" class="dark-reverse">
          </noscript>
        </a>
      </li>
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
</div>

{% if collections.projects | length > 0 %}
<section>
  <h2><a href="/projects/">Projects</a></h2>
  {% for project in collections.projects %}
  {{ AppBox(project, "h3") }}
  {% endfor %}
</section>
{% endif %}

{% if collections.posts | length > 0 %}
<section>
  <h2><a href="/posts/">Posts</a></h2>
  {% for post in collections.posts | firstItems(3) %}
  {{ PostBox(post, "h3") }}
  {% endfor %}
</section>
{% endif %}

{% if collections.notes | length > 0 %}
<section>
  <h2><a href="/notes/">Notes</a></h2>
  {% for post in collections.notes | firstItems(3) %}
  {{ PostBox(post, "h3") }}
  {% endfor %}
</section>
{% endif %}
