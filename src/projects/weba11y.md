---
layout: "default"
lang: "en"
collection: "app"
permalink: "/projects/weba11y/"
title: "WebA11Y"
description: "Improve Web Accessibility in Safari"
icon: "/assets/projects/weba11y/icon.png"
version: "3.4"
links:
  itunes_app: "6445839110"
  appstore: "https://apps.apple.com/app/weba11y/id6445839110"
  source: "https://github.com/Cizzuk/WebA11Y"
---
{% import 'appbox.njk' as components %}

{{ components.appbox(title, description=description, type="title", icon=icon) }}

## Download

[Download on the App Store]({{ links.appstore }})

[AltStore PAL Source](https://i.cizzuk.net/altstore/)

Latest Version: {{ version }}

<details>
  <summary>Compatibility</summary>
  <ul>
    <li>iOS 15.4 or later.</li>
    <li>iPadOS 15.4 or later.</li>
    <li>macOS 12.3 or later.</li>
    <li>visionOS 1.0 or later.</li>
  </ul>
</details>

<details>
  <summary>Languages</summary>
  <ul>
    <li>English</li>
    <li>Japanese</li>
  </ul>
</details>

## Features

You can make the following changes to the Website:

- Boldens all text
- Underline links and buttons
- Reduce animations and transitions
- Use custom fonts
- Insert custom CSS

## License

This application is licensed under the [MIT License]({{ links.source }}/blob/main/LICENSE).

## Source Code

The app is open source, the source code is available on [GitHub]({{ links.source }}).
