---
layout: "post"
lang: "ja"
permalink: "/notes/toggle-vrc-mute-on-ubuntu-wayland/"
title: "Ubuntu WaylandでVRChatのミュートをいつでも切り替えられるようにする"
description: "Wayland環境のUbuntuで、VRChatにフォーカスが当たっていない状態でも、ホットキーやショートカットを用いてミュートを切り替えられるようにします。"
---

## 問題

VRChatにフォーカスが当たっていない状態でも、Discordなどのようにホットキーやショートカットを用いてミュートを切り替えたい。

## 方針

Windows向けにはホットキーでミュートを切り替えられるツールが多数存在しますが、LinuxのWayland環境では他のソフトがキーを監視することは難しいです。なので、Ubuntu標準のカスタムキーボードショートカットからコマンドを実行する形で実現しようと思います。

1. キーボードショートカットからコマンド実行
2. OSC送信
3. VRChatのミュートが切り替わる

という形を目指します。Windowsでやるよりシンプルかも？

## 実施環境

- Ubuntu Desktop 26.04 LTS
- GNOME Shell 50.1
- VRChat on [Proton-RTSP-11.0-20260609-1](https://github.com/SpookySkeletons/proton-ge-rtsp/releases/tag/proton-rtsp-11.0-20260609-1)
- VRChatのマイク設定はToggle (PTTは難しいと思う)

## セットアップ

### OSCをCLIから送れるツールを入れる

[`liblo-tools`](https://packages.ubuntu.com/resolute/liblo-tools)というパッケージに`oscsend`という一行で簡単にOSCメッセージを送信できるコマンドがあるので、ありがたく使わせてもらうことにします。

```bash
sudo apt update
sudo apt install liblo-tools
```

### カスタムショートカットを追加する

設定アプリから、キーボード、ショートカットの表示とカスタマイズと進み、カスタムショートカットを追加します。

名前とショートカットは好きなものに設定して、コマンドの部分を以下のように変更します。もし起動引数でOSCのポートを変えている場合は9000番のところを変えてください。

```sh
/bin/bash -lc 'oscsend 127.0.0.1 9000 /input/Voice T; sleep 0.1; oscsend 127.0.0.1 9000 /input/Voice F'
```

このコマンドは、VRChatの[`/input/Voice`](https://docs.vrchat.com/docs/osc-as-input-controller)にTrueを送ってからすぐFalseを再送するだけです。これでミュートが1回切り替わります。

### VRChatでOSCを有効にする

VRChatのExpressionsメニューから、オプション、OSCと進み、有効化します。

これでセットアップは完了です。

## 使ってみよう

確認のために、Waylandにネイティブ対応している他のアプリにフォーカスを当てた状態で、設定したショートカットを実行してみましょう。

非フォーカス状態のVRChatでマイクの状態が切り替わってたら成功です。
