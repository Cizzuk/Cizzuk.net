---
layout: "default"
lang: "en"
permalink: "/projects/deflector/"
title: "Deflector"
description: "Run any shortcut from the Dynamic Island or Side Button"
icon: "/assets/projects/deflector/icon.png"
version: "0.1"
links:
  itunes_app: "6802068584"
  appstore: "https://apps.apple.com/app/deflector/id6802068584"
  source: "https://github.com/Cizzuk/Deflector"
---

{% from 'appbox.njk' import appbox %}
{% set thisapp = { title: title, description: description, icon: icon } %}
{{ appbox(thisapp, "h1") }}

With Deflector, you can add buttons to the Dynamic Island and Lock Screen to run any shortcut. You can long-press the Dynamic Island to quickly run shortcuts.

On supported iPhones in Japan, you can use your preferred voice assistant via shortcuts using the Side Button.

## Download

[Download on the App Store]({{ links.appstore }})

[AltStore PAL Source]({{ site.links.altstore }})

Latest Version: {{ version }}

<details>
  <summary>Compatibility</summary>
  <ul>
    <li>iOS 27.0 or later.</li>
    <li>iPadOS 27.0 or later.</li>
  </ul>
</details>

<details>
  <summary>Languages</summary>
  <ul>
    <li>English</li>
    <li>Japanese</li>
  </ul>
</details>

## License

This application is licensed under the [MIT License]({{ links.source }}/blob/main/LICENSE).

## Source Code

The app is open source, the source code is available on [GitHub]({{ links.source }}).
