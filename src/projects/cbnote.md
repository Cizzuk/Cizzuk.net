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
version: "2.8"
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

This is a simple note app linked with the file system. You can quickly check and edit your notes using the device's buttons or shortcuts.

{{ AppPreview(preview) }}

## Features

In app settings, you can choose the action for launching from Camera Control from the following options:

- Launch In-App Camera
- Paste from Clipboard
- Add New Note
- Start Audio Recording
- Open CBNote Only
- Open Custom URL

And other features:

- Quick access to notes by launching from the Action Button, Camera Control, Control Center and other shortcut actions
- Easily add new notes by pasting from the clipboard
- Notes can be easily copied to the clipboard with a swipe gesture
- Compatible with many file formats

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
