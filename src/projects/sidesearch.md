---
layout: "default"
lang: "ja"
permalink: "/projects/sidesearch/"
title: "Side Search"
description: "音声アシスタントを好きなものにカスタマイズ"
icon: "/assets/projects/sidesearch/icon.png"
version: "2.0"
links:
  itunes_app: "6756973793"
  appstore: "https://apps.apple.com/app/side-search/id6756973793"
  source: "https://github.com/Cizzuk/Side-Search"
---
{% import 'appbox.njk' as components %}

{{ components.appbox(title, description=description, type="title", icon=icon) }}

お好みのAIアシスタントや検索エンジンを、あなたの音声アシスタントにします。対応する地域では、サイドボタンを長押しして起動できる音声対応アプリです。

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

## 機能

### サイドボタンから起動

対応する地域では、サイドボタンにSide Searchを割り当てることができます。
お好みのアシスタントを、デフォルトのアシスタントにしましょう。

### アシスタント

#### URLベースアシスタント

カスタムのURLを設定することで、さまざまなAIアシスタントや検索エンジンをアシスタントにできます。

#### Apple Foundation Models

Apple Intelligenceに対応しているデバイスで、プライバシー重視のモデルと会話をすることができます。

#### Google Gemini API

ご自身のAPIキーを使用して、Geminiと会話をしたり、Web検索を頼むことができます。

## ライセンス

このアプリは[MIT License]({{ links.source }}/blob/main/LICENSE)でライセンスされています。

## ソースコード

このアプリはオープンソースです。ソースコードは[GitHub]({{ links.source }})で利用できます。
