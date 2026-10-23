---
layout: "default"
lang: "en"
permalink: "/projects/deflector/"
title: "Deflector"
description: "Run shortcuts from Dynamic Island, Watch and more"
icon: "/assets/projects/deflector/icon.png"
preview:
  - "/assets/projects/deflector/preview1.png"
  - "/assets/projects/deflector/preview2.png"
  - "/assets/projects/deflector/preview3.png"
version: "1.1"
links:
  itunes_app: "6802068584"
  appstore: "https://apps.apple.com/app/deflector/id6802068584"
  altstore: "/altstore/?appname=Deflector&bundleid=net.cizzuk.deflector"
  source: "https://github.com/Cizzuk/Deflector"
---

{% from 'AppBox.njk' import AppBox %}
{% from 'AppDownload.njk' import AppDownload %}
{% from 'AppPreview.njk' import AppPreview %}
{% set thisapp = { title: title, description: description, icon: icon } %}

{{ AppBox(thisapp, "h1") }}

{{ AppDownload(links.appstore, links.altstore) }}

With Deflector, you can add buttons to the Dynamic Island, Lock Screen and Apple Watch to run any shortcut.

On supported iPhones in Japan, you can use your preferred voice assistant using shortcuts with the Side Button.

{{ AppPreview(preview) }}

## Information

Version: {{ version }}

<details>
  <summary>Compatibility</summary>
  <ul>
    <li>iOS 27.0 or later.</li>
    <li>iPadOS 27.0 or later.</li>
    <li>watchOS 26.6 or later.</li>
  </ul>
</details>

<details>
  <summary>Languages</summary>
  <ul>
    <li>English</li>
    <li>Japanese</li>
  </ul>
</details>

### License

This application is licensed under the [MIT License]({{ links.source }}/blob/main/LICENSE).

### Source Code

The app is open source, the source code is available on [GitHub]({{ links.source }}).
