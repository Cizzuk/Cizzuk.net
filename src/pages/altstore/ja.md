---
layout: "default"
lang: "ja"
permalink: "/altstore/ja/"
title: "AltStore PALソース"
description: "Cizzuk SourceをAltStore PALに追加すれば、CizzukのiOSアプリをAltStore PALからインストールできるようになります。"
scripts:
  - src: "/assets/altstore/viewapp.js"
    defer: true
alternate_langs:
  - lang: "en"
    name: "English"
    url: "/altstore/en/"
  - lang: "ja"
    name: "日本語"
    url: "/altstore/ja/"
---

# {{ title }}

Cizzuk SourceをAltStore PALに追加すれば、私のiOSアプリをAltStore PALからインストールできるようになります。

[AltStore PALのソースについて](https://faq.altstore.io/altstore-pal/sources)

<div id="viewapp" class="hidden">
  <h2>すでにソースを追加している場合</h2>
  <a id="viewapp-button">AltStore PALで<span id="viewapp-name">アプリのページ</span>を開く</a>
</div>

## ソースを追加する

下記のボタンからAltStore PALを開くか、URLを入力してAltStore PALにソースを追加します。

[Cizzuk SourceをAltStore PALで開く](altstore-pal://source?url=https://i.cizzuk.net/altstore/source.pal.json)

```
https://i.cizzuk.net/altstore/source.pal.json
```

## まだAltStore PALをインストールしていない場合

ソースからアプリをインストールするには、AltStore PALをインストールする必要があります。

[AltStore PALをインストールする](https://altstore.io/download)

AltStore PALを利用するには、お使いのデバイスで代替配信が利用可能である必要があります。

[代替アプリ配信について - Apple サポート (日本)](https://support.apple.com/ja-jp/118110#availability)
