---
layout: "post"
lang: "ja"
permalink: "/notes/svg-support-for-tor-browser/"
canonical: "https://zenn.dev/cizzuk/articles/bcaa6fb4bcd6f4"
description: "Tor Browser上でセキュリティレベルをSafestにするとSVG画像が表示されない問題に対処します。"
noindex: true
title: "Tor Browser向けにSVG画像の対応をする"
---

**これはZennで公開した記事のミラーです。[現物はこちら]({{ canonical }})**

Tor Browser上でセキュリティレベルを最大のSafestにすると、XSS対策でSVG画像が読み込まれなくなります。

サイト内でSVG画像を利用している場合には、これらが表示されないのでかなり不恰好な感じになってしまいます。かと言って全てのブラウザでPNG画像にすれば、画質が劣ったりデータ量が増えたりするわけです。

良い解決方法があるのでメモとして残しておきます。

## 解決方法

必要な時だけPNG画像で表示されるようにします。SafestではJavaScriptが無効になる性質を利用します。

あらかじめPNG版とSVG版の画像を用意しておいて、スクリプトで画像を置き換えるようにします。例えばクラスが`svg`である要素の画像の拡張子を`.png`から`.svg`に置き換えるとか。これは[Tor Project](https://www.torproject.org)や[Tails](https://tails.net)の公式サイトで実際に使用されている手法です。

ただ、この手法には欠点があります。スクリプトによる置換が行われる前に、ブラウザがPNG版の画像を読み込みに行ってしまうので、無駄な帯域を使用してしまうのです。

もっといい方法があります。`<noscript>`を使う方法です。`<div>`なり何なりで親要素を作成し、子要素として`<noscript>`を、さらにその子に画像を入れます。

```html
<div data-svg="image.svg" data-svg-alt="foo">
  <noscript>
    <img src="image.png" alt="foo">
  </noscript>
</div>
```

ここからJavaScriptで、`data-svg`属性がある要素の中に新たな`<img>`要素を作成するスクリプトを作成します。

```js
// data-svg属性を持つ要素を全て取得
const svgElements = document.querySelectorAll('[data-svg]');

svgElements.forEach(element => {
  // <img>要素を作る
  const img = document.createElement('img');
  img.src = element.getAttribute('data-svg');
  img.alt = element.getAttribute('data-svg-alt');
  
  element.appendChild(img);
});
```

最後にこのスクリプトを、インラインの場合は`<body>`の最下部に置き、外部ファイルの場合は`<head>`内で`defer`で読み込みます。

この方法ならJavaScriptが利用可能な環境ではPNG版の画像要素自体が無視されるので、画像が読み込まれることはありません。

## できそうでダメだった対処法

`<picture>`を使う方法です。

```html
<picture>
  <source srcset="image.svg" type="image/svg+xml">
  <img src="image.png" alt="foo">
</picture>
```

これだとSVGの方を読み込もうとした上で、結局何も表示されません。
