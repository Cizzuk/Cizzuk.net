---
layout: "default"
lang: "en"
collection: "app"
permalink: "/projects/falll/"
title: "FALLLL"
icon: "/assets/projects/falll/icon.png"
version: "4.0.2"
links:
  playweb: "https://i.cizzuk.net/junk/falll/"
  itunes_app: "1526930790"
  appstore: "https://apps.apple.com/app/fallll/id1526930790"
  msstore: "https://www.microsoft.com/store/apps/9NJ13XVFLH0Z"
  apk: "https://i.cizzuk.net/file/FALLLL.apk"
  linux: "https://i.cizzuk.net/file/FALLLL.tar.xz"
  altstore: "altstore://install?url=https://i.cizzuk.net/file/FALLLL-iOS.ipa"
hidden: true
---
{% import 'appbox.njk' as components %}

{{ components.appbox(title, type="title", icon=icon) }}

[Play on the Web]({{ links.playweb }})

## Download

Latest Version: {{ version }}

- [Download on the App Store]({{ links.appstore }})
- [Get it from Microsoft Store]({{ links.msstore }})
- [Andriod (APK)]({{ links.apk }})
- [Linux (x86_64)]({{ links.linux }})
- [AltStore]({{ links.altstore }})

<details>
  <summary>Compatibility</summary>
  <ul>
    <li>iOS 12.0 or later.</li>
    <li>iPadOS 12.0 or later.</li>
    <li>macOS 10.13.0 or later.</li>
    <li>tvOS 12.0 or later.</li>
    <li>Windows 10 Version 10240.0 or later.</li>
    <ul>
      <li>x86</li>
      <li>x64</li>
      <li>Arm</li>
      <li>Arm64</li>
    </ul>
    <li>Linux</li>
    <ul>
      <li>x64</li>
    </ul>
    <li>Android 9.0 or later.</li>
  </ul>
</details>

<details>
  <summary>Languages</summary>
  <ul>
    <li>English</li>
    <li>Japanese</li>
    <li>Spanish</li>
  </ul>
</details>

