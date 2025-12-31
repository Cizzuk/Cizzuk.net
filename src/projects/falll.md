---
layout: "default"
lang: "en"
collection: "app"
permalink: "/projects/falll/"
title: "FALLLL"
icon: "/assets/projects/falll/icon.png"
version: "4.0.5"
links:
  playweb: "https://i.cizzuk.net/junk/falll/"
  itunes_app: "1526930790"
  store:
    appstore: "https://apps.apple.com/app/fallll/id1526930790"
    msstore: "https://www.microsoft.com/store/apps/9NJ13XVFLH0Z"
    playstore: "https://play.google.com/store/apps/details?id=tsg0o0.FALLL"
  file:
    ios: "https://i.cizzuk.net/bucket/falll/FALLLL-iOS.ipa"
    macos: "https://i.cizzuk.net/bucket/falll/FALLLL.dmg"
    tvos: "https://i.cizzuk.net/bucket/falll/FALLLL-tvOS.ipa"
    win: "https://i.cizzuk.net/bucket/falll/FALLLL-Windows.zip"
    linux: "https://i.cizzuk.net/bucket/falll/FALLLL-Linux.tar.gz"
    apk: "https://i.cizzuk.net/bucket/falll/FALLLL.apk"
hidden: true
---
{% import 'appbox.njk' as components %}

{{ components.appbox(title, type="title", icon=icon) }}

[Play on the Web]({{ links.playweb }})

## Download

Latest Version: {{ version }}

### Stores

- [Download on the App Store]({{ links.store.appstore }})
- [Get it from Microsoft Store]({{ links.store.msstore }})

### Files

- [Linux (x64, TAR.GZ)]({{ links.file.linux }})
- [Android (APK)]({{ links.file.apk }})
- [macOS (Universal, DMG)]({{ links.file.macos }})
- [Windows (x64, ZIP)]({{ links.file.win }})
- [iOS (IPA)]({{ links.file.ios }})
  - [Direct install on AltStore Classic](altstore-classic://install?url={{ links.file.ios }})
- [tvOS (IPA)]({{ links.file.tvos }})

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
      <li>Arm64</li>
    </ul>
    <li>Linux</li>
    <ul>
      <li>x64</li>
    </ul>
    <li>Android 9.0 or later.</li>
  </ul>
</details>

---

Also available for Game Boy: [FALLLL for GB](https://github.com/Cizzuk/falll-4gb)
