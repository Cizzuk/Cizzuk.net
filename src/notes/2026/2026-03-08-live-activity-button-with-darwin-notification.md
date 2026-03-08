---
layout: "post"
lang: "ja"
permalink: "/notes/live-activity-button-with-darwin-notification/"
canonical: "https://zenn.dev/cizzuk/articles/6966d91269e511"
title: "Live Activityにボタンを追加してバックグラウンドで動作中の本体アプリに通知する"
description: "アプリを開かずにLive Activityのボタンから、バックグラウンドにある本体アプリを操作できるようにする方法を解説します。"
noindex: true
---

**これはZennで公開した記事のミラーです。[現物はこちら]({{ canonical }})**

![Live Activityの例: 左にアプリアイコン、中央に状態を示すテキスト、右に終了ボタン](/assets/notes/live-activity-button-with-darwin-notification/1.png)

ロック画面やDynamic Islandで表示されるLive Activityには、App Intentを実行する任意のボタンを追加することができます。

しかしLive ActivityはExtensionで、本体のアプリとは別のプロセスになっています。App IntentはExtensionとして実行されるので、本体アプリの処理を呼んだり、サンドボックスにアクセスすることはできません。

通常はそもそも本体アプリがフォアグラウンドではないので、App Groupの共有コンテナにでもデータを保存しておいて、次回起動時にそこからデータを取れば済む話です。

問題は、Live Activityの実行中にずっとバックグラウンドで処理を継続するタイプのアプリで起きます。例えば音楽を再生していたり、マイクで録音していたり、位置情報を読み取り続けている場合などです。

アプリを開かずにLive Activityから本体アプリを操作できるようにしたい。

## Darwin Notificationを使う

Darwin Notificationは古いAPIで、プロセスを超えてすべてのプロセスに向けて通知できる低レイヤーのAPIです。NotificationCenterのシステム全体版みたいな感じですね。

これを使えば異なるプロセス間、もっと言えばアプリ間でも通知を送れます。ただし、NotificationCenterのようにデータを含めることはできないため、App Groupと併用しましょう。

### 通知を送る

[CFNotificationCenterPostNotification](https://developer.apple.com/documentation/corefoundation/cfnotificationcenterpostnotification(_:_:_:_:_:))を使います。

以下のような形で、Live ActivityのApp Intentから通知を送ります。

```swift:LiveActivityButtonIntent.swift
CFNotificationCenterPostNotification(
    CFNotificationCenterGetDarwinNotifyCenter(),
    CFNotificationName("com.example.sample" as CFString),
    nil,
    nil,
    true
)
```

1つ目の引数では、送信先の通知センターを指定します。

2つ目では通知の名前を指定します。通知はすべてのプロセスに送信されるので、競合しないような名前にします。

3, 4, 5つ目は今回はスルー。

### 通知を受け取る(監視する)

まずは通知を受けたときの処理を、[CFNotificationCallback](https://developer.apple.com/documentation/corefoundation/cfnotificationcallback)に合わせて作成します。

```swift
private static let DarwinNotifyCallback: CFNotificationCallback = { _, observer, _, _, _ in
    guard let observer else { return }
    let viewModel = Unmanaged<RecorderViewModel>.fromOpaque(observer).takeUnretainedValue()
        // MARK: ここで通知を受け取った時の処理をする
}
```

任意のタイミングでインスタンスにObserverを追加します。

```swift
CFNotificationCenterAddObserver(
    CFNotificationCenterGetDarwinNotifyCenter(),
    Unmanaged.passUnretained(self).toOpaque(),
    Self.DarwinNotifyCallback,
    "com.example.sample" as CFString,
    nil,
    .deliverImmediately
)
```

Observerは必要なくなったときに削除しましょう。以下を実行するとそのインスタンスにあるObserverをすべて削除できます。`deinit`などに書いておくといいと思います。

```swift
CFNotificationCenterRemoveObserver(
    CFNotificationCenterGetDarwinNotifyCenter(),
    Unmanaged.passUnretained(self).toOpaque(),
    nil,
    nil
)
```

## 脆弱性に注意

Darwin Notificationはどのプロセスからでも通知を送れます。脆弱性の温床です。実際過去に、デバイスを強制的に再起動する脆弱性が存在していました。

特に通知を受け取った後に重要な処理をする場合は、必ずApp Groupを通したチェックをする方が良いです。

これは簡単に

1. Live Activity側で共有のUserDefaultsの適当なキーにフラグを立てる
2. Live Activity側でDarwin Notificationを送る
3. 本体アプリでDarwin Notificationを受け取る
4. 本体アプリで共有のUserDefaultsにあるフラグを読み取る
5. フラグが立っていれば処理をする(同時にフラグを戻す)

みたいな単純なものでも十分に対策できます。
