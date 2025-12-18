---
layout: "default"
lang: "en"
permalink: "/projects/cbnote/"
title: "CBNote"
description: "Replace Camera Control with Note app."
icon: "/assets/projects/cbnote/icon.png"
version: "1.2"
links:
  itunes_app: "6756120567"
  appstore: "https://apps.apple.com/app/cbnote/id6756120567"
  source: "https://github.com/Cizzuk/CBNote"
---
{% import 'appbox.njk' as components %}

{{ components.appbox(title, description=description, type="title", icon=icon) }}

This is a simple note app linked with the file system. You can quickly check and edit your notes using the device's buttons or shortcuts.

## Download

Latest Version: {{ version }}

[Download on the App Store]({{ links.appstore }})

[AltStore PAL Source](https://i.cizzuk.net/altstore/)

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

## Features

In app settings, you can choose the action for launching from Camera Control from the following options:

- Launch In-App Camera
- Paste from Clipboard
- Add New Note
- Open App Only

And other features:

- Quick access to notes by launching from the Action Button, Camera Control, Control Center and other shortcut actions
- Easily add new notes by pasting from the clipboard
- Notes can be easily copied to the clipboard with a swipe gesture
- Compatible with many file formats

## License

This application is licensed under the [MIT License]({{ links.source }}/blob/main/LICENSE).

## Source Code

The app is open source, the source code is available on [GitHub]({{ links.source }}).
