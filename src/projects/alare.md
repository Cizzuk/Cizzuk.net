---
layout: "default"
lang: "en"
permalink: "/projects/alare/"
title: "Alare"
description: "Alarm app to prevent oversleeping"
icon: "/assets/projects/alare/icon.png"
version: "1.2"
links:
  itunes_app: "6759486773"
  appstore: "https://apps.apple.com/app/alare/id6759486773"
  source: "https://github.com/Cizzuk/Alare"
---

{% from 'appbox.njk' import appbox %}
{% set thisapp = { title: title, description: description, icon: icon } %}
{{ appbox(thisapp, "h1") }}

This is an alarm app. However, you cannot stop it easily.

Alare's alarm will continue to snooze automatically until you perform a special action. To prevent oversleeping, select an action that you believe will wake you up!

## Download

[Download on the App Store]({{ links.appstore }})

[AltStore PAL Source]({{ site.links.altstore }})

Latest Version: {{ version }}

<details>
  <summary>Compatibility</summary>
  <ul>
    <li>iOS 26.2 or later.</li>
    <li>iPadOS 26.2 or later.</li>
  </ul>
</details>

<details>
  <summary>Languages</summary>
  <ul>
    <li>English</li>
    <li>Japanese</li>
  </ul>
</details>

## Wake-up Actions

Here are the actions available to stop an alarm:

- Wave Device
  - Wave the device slowly and broadly like a flag.
- Scan Code
  - Scan the code placed outside the bed.
- Drum Roll
  - Drum roll your fingers on the screen.
- Tap Button
  - Just tap the button once.

## License

This application is licensed under the [MIT License]({{ links.source }}/blob/main/LICENSE).

## Source Code

The app is open source, the source code is available on [GitHub]({{ links.source }}).
