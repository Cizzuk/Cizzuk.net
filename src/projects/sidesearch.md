---
layout: "default"
lang: "ja"
permalink: "/projects/sidesearch/"
title: "Side Search"
description: "音声アシスタントを好きなものにカスタマイズ"
icon: "/assets/projects/sidesearch/icon.png"
version: "1.0"
links:
  itunes_app: "6756973793"
  appstore: "https://apps.apple.com/app/side-search/id6756973793"
  source: "https://github.com/Cizzuk/Side-Search"
---
{% import 'appbox.njk' as components %}

{{ components.appbox(title, description=description, type="title", icon=icon) }}

サイドボタンやアクションボタンなどからすばやく起動して、お好みのAIアシスタントや検索エンジンを、あなたの音声アシスタントにすることができます。対応する地域で、サイドボタンを長押しして起動できる音声対応アプリです。

## ダウンロード

[App Storeからダウンロード]({{ links.appstore }})

[AltStore PAL ソース](https://i.cizzuk.net/altstore/)

最新バージョン: {{ version }}

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
