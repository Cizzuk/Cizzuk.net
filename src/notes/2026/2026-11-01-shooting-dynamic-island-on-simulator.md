---
layout: "post"
lang: "ja"
permalink: "/notes/shooting-dynamic-island-on-simulator/"
canonical: "https://zenn.dev/cizzuk/articles/d2affa72d3f012"
title: "Device HubでDynamic Islandを撮影する"
description: "Device HubのSimulatorでスクリーンショットを撮影するとDynamic Islandが消えてしまうので、他の撮影方法を紹介します。"
noindex: true
---

**これはZennで公開した記事のミラーです。[現物はこちら]({{ canonical }})**

Device Hubでスクリーンショットの撮影ボタンを押すと、Dynamic Islandが消失します。

![通常時のDynamic Islandの比較。左がスクリーンショット、右が実際の画面。](/assets/notes/shooting-dynamic-island-on-simulator/1.png)

別に消えてくれて問題ないように思えますが、普通に大問題です。これはDynamic Island上のライブアクティビティも非表示にしてしまうからです。

![ライブアクティビティ展開時のDynamic Islandの比較。左がスクリーンショット、右が実際の画面。](/assets/notes/shooting-dynamic-island-on-simulator/2.png)

Dynamic Islandとライブアクティビティに関するスクリーンショットを取りたい時にどうすれば良いでしょうか？(Device Hub全体のスクリーンショットや録画した動画から切り出す方法は画質に影響してしまうので却下です。)

## 解決法 - ショートカットをつかう

Simulatorにはショートカットアプリがあります。次のようなショートカットを作成してみましょう。10秒待ってからスクリーンショットを撮影し、クリップボードに保存するショートカットです。

[Take Screenshot - Shared with iCloud](https://www.icloud.com/shortcuts/0a17e4caa0d043d5875ecb281cee0bee)

![ショートカット編集画面のスクリーンショット。Wait 10 seconds, Take screenshot, Copy Screenshot to clipboardの順に設定されている。](/assets/notes/shooting-dynamic-island-on-simulator/3.png)

作成できたら早速スクリーンショットを撮影してみましょう。

1. ショートカットを実行する
2. 10秒以内に撮影準備を整える
3. スクリーンショットが撮影されるまで待つ(画面が一瞬白くなる)
4. Mac上のFinderでペーストする
5. Dynamic Islandが写ったスクリーンショットがペーストされる

ショートカットによるスクリーンショットではDynamic Islandが残る仕様らしいです。これでApp Storeに提出するためのスクリーンショットにDynamic Islandとライブアクティビティを含めることができますね。

## おまけ - iOS 27.1 SDKのDuoの話

iPhone Duoの最初のSimulatorには、設定とSafariを除くアプリが入っておらず、ショートカットがないためにこの記事の撮影方法は使えませんでした。

DeflectorというアプリでDuoのDynamic Islandを撮影する必要があったので、困った私はちょっと強引な方法でショートカットをDuoのSimulatorにインストールしていました。

### iOS 27.0のShortcuts.appをサイドロード

`/Library/Developer/CoreSimulator/Volumes/`にはSimulatorの本体があります。ここにある`iOS_24A434`(iOS 27.0 Simulator)から`Shortcuts.app`を奪ってきます。

`/Library/Developer/CoreSimulator/Volumes/iOS_24A434/Library/Developer/CoreSimulator/Profiles/Runtimes/iOS 27.0.simruntime/Contents/Resources/RuntimeRoot/Applications/Shortcuts.app`にあります。

これはiOS 27 SDKのShortcuts.appなのでDuo向けに最適化されているわけではありませんが、機能的には問題なく動作します。

デスクトップなどに`Payload`というフォルダを作り、そこに`Shortcuts.app`をコピーします。`Payload`をZIPにして、拡張子を`.ipa`にすれば互換性のあるSimulatorにサイドロードできるようになります。

iPhone DuoのSimulatorを起動して、右サイドメニュー > Info > Appsに作成したIPAファイルをドラッグ&ドロップすると、ショートカットがSimulatorにインストールされます。

あとはこの記事の方法でDynamic Islandを撮影し、無事にDuo用のスクリーンショットを用意することができました。めでたしめでたし。
