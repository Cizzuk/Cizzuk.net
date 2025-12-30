---
layout: "default"
lang: "ja"
permalink: "/projects/sidesearch/"
title: "Side Search"
description: "音声アシスタントを好きなものにカスタマイズ"
icon: "/assets/projects/sidesearch/icon.png"
version: "0.1"
hidden: true
links:
  itunes_app: "6756973793"
  appstore: "https://apps.apple.com/app/sidesearch/id6756973793"
  source: "https://github.com/Cizzuk/Side-Search"
---
{% import 'appbox.njk' as components %}

{{ components.appbox(title, description=description, type="title", icon=icon) }}

対応する地域で、サイドボタンに割り当てることができる音声対応アプリです。サイドボタンやショートカットから、お好みのAIアシスタントや検索エンジンを声で利用することができます。

このアプリは[Side Button Access](https://developer.apple.com/documentation/AppIntents/Launching-your-voice-based-conversational-app-from-the-side-button-of-iPhone)を利用した、日本にあるiPhone向けの音声ベース会話アプリです。

## ダウンロード

最新バージョン: {{ version }}

[App Storeからダウンロード]({{ links.appstore }})

[AltStore PAL ソース](https://i.cizzuk.net/altstore/)

<details>
  <summary>互換性</summary>
  <ul>
    <li>iOS 26.2 またはそれ以降。</li>
    <li>iPadOS 26.2 またはそれ以降。</li>
  </ul>
</details>

<details>
  <summary>言語</summary>
  <ul>
    <li>英語</li>
    <li>日本語</li>
  </ul>
</details>

## ライセンス

このアプリは[MIT License]({{ links.source }}/blob/main/LICENSE)でライセンスされています。

## ソースコード

このアプリはオープンソースです。ソースコードは[GitHub]({{ links.source }})で利用できます。
