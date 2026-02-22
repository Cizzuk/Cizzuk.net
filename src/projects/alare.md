---
layout: "default"
lang: "en"
permalink: "/projects/alare/"
title: "Alare"
description: "No more oversleeping!"
icon: "/assets/projects/alare/icon.png"
version: "0.1"
links:
  # itunes_app: "6759486773"
  # appstore: "https://apps.apple.com/app/alare/id6759486773"
  source: "https://github.com/Cizzuk/Alare"
hidden: true
---

{% from 'appbox.njk' import appbox %}
{% set thisapp = { title: title, description: description, icon: icon } %}
{{ appbox(thisapp, "h1") }}

This is an alarm app. However, you cannot stop it easily.
You need to perform an additional action in this app to stop the alarm completely.
No more oversleeping!

**THIS APP IS CURRENTLY IN BETA**

Its operation may be unstable, and settings may not be carried over to future versions.
I would appreciate it if you could send us feedback if you encounter any issues.

## Download

<!-- [Download on the App Store]({{ links.appstore }}) -->

<!-- [AltStore PAL Source]({{ site.links.altstore }}) -->

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

## License

This application is licensed under the [MIT License]({{ links.source }}/blob/main/LICENSE).

## Source Code

The app is open source, the source code is available on [GitHub]({{ links.source }}).
