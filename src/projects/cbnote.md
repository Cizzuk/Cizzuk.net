---
layout: "default"
lang: "en"
permalink: "/projects/cbnote/"
title: "CBNote"
description: "Replace Camera Control with Note app."
icon: "/assets/projects/cbnote/icon.png"
version: "0.1"
links:
  itunes_app: "6756120567"
  appstore: "https://apps.apple.com/app/cbnote/id6756120567"
---
{% import 'appbox.njk' as components %}

{{ components.appbox(title, description=description, type="title", icon=icon) }}

This is a simple note app linked with the file system. It can display text and images, and can save all other files.

## Download

Latest Version: {{ version }}

[Download on the App Store]({{ links.appstore }})

[AltStore PAL Source](https://i.cizzuk.net/altstore/)

<details>
  <summary>Compatibility</summary>
  <ul>
    <li>iOS 26.0 or later.</li>
    <li>iPadOS 26.0 or later.</li>
  </ul>
</details>

<details>
  <summary>Languages</summary>
  <ul>
    <li>English</li>
  </ul>
</details>

## Features

In app settings, you can choose the action for launching from Camera Control from the following options:

- Launch In-App Camera
- Paste from Clipboard
- Add New Note
- Open App Only

And other app features:

- The in-app camera shutter sound will be silent in Japan as well.
- Quick access to notes by launching from the Action Button, Camera Control, Control Center and other shortcut actions.
- Easily add new notes by pasting from the clipboard.
- Notes can be easily copied to the clipboard with a swipe gesture.
