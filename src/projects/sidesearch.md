---
layout: "default"
lang: "ja"
permalink: "/projects/sidesearch/"
title: "Side Search"
description: "サイドボタンをカスタマイズ"
icon: "/assets/projects/sidesearch/icon.png"
version: "2.9"
links:
  itunes_app: "6756973793"
  appstore: "https://apps.apple.com/app/side-search/id6756973793"
  source: "https://github.com/Cizzuk/Side-Search"
---

{% from 'appbox.njk' import appbox %}
{% set thisapp = { title: title, description: description, icon: icon } %}
{{ appbox(thisapp, "h1") }}

サイドボタンやアクションボタンから素早く起動して、お好みのAIアシスタントや検索エンジンを、音声アシスタントとして利用できます。

このアプリは[Side Button Access](https://developer.apple.com/documentation/AppIntents/Launching-your-voice-based-conversational-app-from-the-side-button-of-iPhone)を利用した、サイドボタンをカスタマイズするための音声ベース会話アプリです。

## ダウンロード

[App Storeからダウンロード]({{ links.appstore }})

[AltStore PAL ソース]({{ site.links.altstore }})

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

日本のiPhoneでは、サイドボタンにSide Searchのアシスタントを割り当てることができます。  
サイドボタンを長押しして、お気に入りのアシスタントを起動できます。

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
