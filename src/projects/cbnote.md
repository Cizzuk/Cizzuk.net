---
layout: "default"
lang: "en"
permalink: "/projects/cbnote/"
title: "CBNote"
description: "Replace Camera Control with Note app"
icon: "/assets/projects/cbnote/icon.png"
preview:
  - "/assets/projects/cbnote/preview1.png"
  - "/assets/projects/cbnote/preview2.png"
  - "/assets/projects/cbnote/preview3.png"
version: "3.0"
links:
  itunes_app: "6756120567"
  appstore: "https://apps.apple.com/app/cbnote/id6756120567"
  altstore: "/altstore/?appname=CBNote&bundleid=net.cizzuk.cbnote"
  source: "https://github.com/Cizzuk/CBNote"
---

{% from 'AppBox.njk' import AppBox %}
{% from 'AppDownload.njk' import AppDownload %}
{% from 'AppPreview.njk' import AppPreview %}
{% set thisapp = { title: title, description: description, icon: icon } %}

{{ AppBox(thisapp, "h1") }}

{{ AppDownload(links.appstore, links.altstore) }}

A simple note app integrated with the file system. You can quickly view and edit notes using your device's buttons or Shortcuts.

{{ AppPreview(preview) }}

## Key Features

- Customize what happens when launched from Camera Control
- View & edit notes from Action Button, Camera Control, etc.
- Create notes by pasting from the clipboard
- Easily copy notes with a swipe
- Supports many file formats

## Information

Version: {{ version }}

<details>
  <summary>Compatibility</summary>
  <ul>
    <li>iOS 26.1 or later.</li>
    <li>iPadOS 26.1 or later.</li>
    <li>macOS 26.1 or later.</li>
    <li>visionOS 26.1 or later.</li>
    <li>watchOS 26.1 or later.</li>
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
