---
layout: "default"
lang: "en"
permalink: "/projects/cse/"
title: "Customize Search Engine"
description: "Customize your Safari's Search Engine"
icon: "/assets/projects/cse/icon.png"
version: "4.12"
links:
  itunes_app: "6445840140"
  appstore: "https://apps.apple.com/app/cse/id6445840140"
  source: "https://github.com/Cizzuk/CSE"
---
{% import 'appbox.njk' as components %}

{{ components.appbox(title, description=description, type="title", icon=icon) }}

This extension allows you to use your preferred search engines, such as non-default search engines or AI assistants.

You can also use it to change search engine settings, for example, by hiding AI Overviews or changing language settings.

## Download

[Download on the App Store]({{ links.appstore }})

[AltStore PAL Source](https://i.cizzuk.net/altstore/)

Latest Version: {{ version }}

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

### Customize your Search Engine

Change Safari's default search engine.  

### CSE for Private Browse

Switch search engines in Private Browse.

### Quick Search

Enter the keyword to switch search engines.

Example:
  - Search [br something](https://search.brave.com/search?q=something) to search in Brave Search
  - Search [wiki Safari](https://en.wikipedia.org/w/index.php?title=Special:Search&search=Safari) tofind Safari on Wikipedia
  - Search [yt Me at the zoo](https://www.youtube.com/results?search_query=Me+at+the+zoo) to findthe oldest videos on YouTube
  - Search [wbm example.com](https://web.archive.org/web/*/example.com) to see past versions of the website

### Emoji Search

If you enter only one emoji, you can search it on [Emojipedia.org](https://emojipedia.org).

### Switch Search Engines by Shortcuts and Focus

You can use a different custom search engine or disable CSE while at work, school, etc.

## License

This application is licensed under the [MIT License]({{ links.source }}/blob/main/LICENSE).

## Source Code

The app is open source, the source code is available on [GitHub]({{ links.source }}).
