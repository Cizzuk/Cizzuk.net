---
layout: "post"
lang: "ja"
permalink: "/posts/sidesearch0.1/"
title: "新しいアプリ、Side Searchをリリースしました"
icon: "/assets/projects/sidesearch/icon.png"
tags: ['sidesearch']
---

{% from 'appbox.njk' import appbox %}
{{ appbox(collections.projects.sidesearch, "strong") }}

対応する地域で、サイドボタンに割り当てることができる音声対応アプリです。サイドボタンやショートカットから、お好みのAIアシスタントや検索エンジンを声で利用することができます。

このアプリは[Side Button Access](https://developer.apple.com/documentation/AppIntents/Launching-your-voice-based-conversational-app-from-the-side-button-of-iPhone)を利用した、日本にあるiPhone向けの音声ベース会話アプリです。

[App Store]({{ collections.projects.sidesearch.links.appstore }})と[AltStore PAL]({{ site.links.altstore }})で利用できます。
