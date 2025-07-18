---
layout: "default"
lang: "en"
collection: "app"
permalink: "/app/cse/"
description: "Safari Extension to customize your search engine."
hide_title: true
icon: "/assets/app/cse/icon.png"
itunes_app: "6445840140"
title: "Customize Search Engine"
---

{% include appbox.html title=page.title type="title" icon=page.icon description=page.description %}

## Download

Latest Version: {{ site.data.meta.cse.latest }}

[Download on the App Store]({{ site.data.meta.cse.appstore }})

[Add Source to AltStore PAL](altstore-pal://source?url={{ site.data.meta.altstore.palsource }})

<details>
  <summary>Compatibility</summary>
  <ul>
    <li>iOS 16.0 or later.</li>
    <li>iPadOS 16.0 or later.</li>
    <li>macOS 13.0 or later.</li>
    <li>visionOS 1.0 or later.</li>
  </ul>
</details>

<details>
  <summary>Languages</summary>
  <ul>
    <li>Arabic</li>
    <li>English</li>
    <li>French</li>
    <li>German</li>
    <li>Japanese</li>
    <li>Korean</li>
    <li>Portuguese</li>
    <li>Russian</li>
    <li>Simplified Chinese</li>
    <li>Spanish</li>
    <li>Traditional Chinese</li>
    <li>Ukrainian</li>
  </ul>
</details>

## Features

Customize your Search Engine
:  Change Safari's default search engine.  
   This is the most basic feature.

CSE for Private Browse
:  Switch search engines in Private Browse.

Quick Search
:  Enter the keyword at the top to switch search engines.  
   Example:
   - Search [br something](https://search.brave.com/search?q=something) to search in Brave Search
   - Search [wiki Safari](https://en.wikipedia.org/w/index.php?title=Special:Search&search=Safari) to find Safari on Wikipedia
   - Search [yt Me at the zoo](https://www.youtube.com/results?search_query=Me+at+the+zoo) to find the oldest videos on YouTube
   - Search [wbm example.com](https://web.archive.org/web/*/example.com) to see past versions of the website

Emoji Search
:  If you enter only one emoji, you can search on [Emojipedia.org](https://emojipedia.org).

Switch Search Engines by Shortcuts and Focus
:  You can use a different custom search engine or disable CSE while at work, school, etc.

## License

This application is licensed under the [MIT License](https://github.com/Cizzuk/CSE/blob/main/LICENSE).

## Source Code

The app is open source, the source code is available on [GitHub]({{ site.data.meta.cse.source }}).
