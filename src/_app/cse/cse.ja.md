---
layout: "default"
lang: "ja"
collection: "app"
permalink: "/app/cse/"
description: "Safariの検索エンジンをカスタマイズするための拡張機能です。"
hide_title: true
icon: "/assets/app/cse/icon.png"
itunes_app: "6445840140"
title: "Customize Search Engine"
---

{% assign meta = meta.cse %}
{% include appbox.html title=page.title type="title" icon=page.icon description=page.description %}

## ダウンロード

最新バージョン: {{ site.data.meta.cse.latest }}

[App Storeからダウンロード]({{ site.data.meta.cse.appstore }})

[AltStore PALにソースを追加](altstore-pal://source?url={{ site.data.meta.altstore.palsource }})

<details>
  <summary>要件</summary>
  <ul>
    <li>iOS 16.0またはそれ以上</li>
    <li>iPadOS 16.0またはそれ以上</li>
    <li>macOS 13.0またはそれ以上</li>
    <li>visionOS 1.0またはそれ以上</li>
  </ul>
</details>

<details>
  <summary>言語</summary>
  <ul>
    <li>アラビア語</li>
    <li>英語</li>
    <li>フランス語</li>
    <li>ドイツ語</li>
    <li>日本語</li>
    <li>韓国語</li>
    <li>ポルトガル語</li>
    <li>ロシア語</li>
    <li>簡体中国語</li>
    <li>スペイン語</li>
    <li>繁体中国語</li>
    <li>ウクライナ語</li>
  </ul>
</details>

## 機能

検索エンジンをカスタマイズ
:  Safariのデフォルトの検索エンジンを変更します。  
   最も標準的な機能です。

プライベートブラウズ用のCSE
:  プライベートブラウズで検索エンジンを切り替えられます。

クイック検索
:  キーワードを先頭に入力して、検索エンジンを切り替えます。  
   例えば:
   - [br something](https://search.brave.com/search?q=something)と検索するとBrave Searchで検索します
   - [wiki Safari](https://ja.wikipedia.org/w/index.php?title=Special:Search&search=Safari)と検索するとWikipediaでSafariの記事を探します
   - [yt Me at the zoo](https://www.youtube.com/results?search_query=Me+at+the+zoo)と検索するとYouTubeで最も古い動画を見つけられます
   - [wbm example.com](https://web.archive.org/web/*/example.com)と検索すると過去のバージョンのWebサイトを見ることができます

絵文字検索
:  絵文字を一文字だけ入力すると、[Emojipedia.org](https://emojipedia.org)でその絵文字を検索します。

ショートカットや集中モードで検索エンジンを切り替え
:  仕事中や学校などで別の検索エンジンを使ったり、あるいはCSEを無効にしたりできます。

## ライセンス

このアプリは[MIT License](https://github.com/Cizzuk/CSE/blob/main/LICENSE)の下でライセンスされています。

## ソースコード

このアプリはオープンソースであるため、[GitHub]({{ site.data.meta.cse.source }})でソースコードが利用可能です。
