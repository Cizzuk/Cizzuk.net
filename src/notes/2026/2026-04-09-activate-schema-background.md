---
layout: "post"
lang: "ja"
permalink: "/notes/activate-schema-background/"
canonical: "https://zenn.dev/cizzuk/articles/ddc675c870d852"
title: "Side Button Accessでアプリの強制起動を回避する"
description: "Side Button Accessで使用するactivateスキーマに準拠したApp Intentを、バックグラウンドで実行する方法を解説します。"
noindex: true
---

**これはZennで公開した記事のミラーです。[現物はこちら]({{ canonical }})**

日本でしか使えない[Side Button Access](https://developer.apple.com/documentation/appintents/launching-your-voice-based-conversational-app-from-the-side-button-of-iphone)では、サイドボタンから起動するアシスタントをSiriの代替として、他のサードパーティ製の音声アシスタントに置き換えることができます。

ざっくり実装方法を言うと、

1. [Side Button Access](https://developer.apple.com/documentation/BundleResources/Entitlements/com.apple.developer.side-button-access.allow)のEntitlementを追加する
2. [activate](https://developer.apple.com/documentation/appintents/assistantschemas/assistantintent/activate)スキーマに準拠したApp Intentを作成する

だけです。

この記事ではactivateスキーマに関することを話します。

## フォアグラウンドになることを強制されてしまう

activateスキーマでは[`supportedModes`](https://developer.apple.com/documentation/appintents/appintent/supportedmodes)を`.foreground`に設定しないと、ビルド時にエラーを吐かれてしまいます。

```swift
@AppIntent(schema: .assistant.activate)
struct ActivateVoiceBasedConversationSceneIntent {
    static let supportedModes: IntentModes = .foreground // これ
    
    @MainActor
    func perform() async throws -> some IntentResult {
        return .result()
    }
}
```

これは当たり前で、サードパーティのアプリはバックグラウンドからマイクを開始することができず、音声アシスタントを開始するにはアプリをフォアグラウンドにする必要があるからです。

でもつまんない。

## 実は後から上書きできる

ドキュメントでは`static let`で宣言されてるし、一見するとどうにもならないように見えます。でもこれ実は`static var`でもOKです。例えば以下のようにしてみましょう。

```swift
@AppIntent(schema: .assistant.activate)
struct ActivateVoiceBasedConversationSceneIntent {
    static var supportedModes: IntentModes = .foreground // varにする
    
    // すぐに書き換える
    init() {
        Self.supportedModes = .background
    }
    
    @MainActor
    func perform() async throws -> some IntentResult {
        // ついでにメッセージも残す
        print("Hello from background!")
        return .result()
    }
}
```

これでもビルドは通ります。

ビルド時に文句を言われないように宣言時には`.foreground`としていますが、実際にはインスタンスが最初に作成されたときに`.background`に変更されます。後から動的に変更が可能なんですね。

実際に実機で試してみるとわかりますが、サイドボタンを長押ししてもアプリは起動しません。しかし`perform()`はちゃんと実行されるので、コンソールには「Hello from background!」とメッセージが流れます。

## バグっぽい挙動に注意

`perform()`で時間のかかる処理をすると、完了するまでの間ずっと何故かサイドボタンで画面をロックできなくなります。

とはいえ`perform()`は約30秒以上処理が終わらないと強制終了されるので、もしもの事があっても30秒待つかアプリを強制終了すれば回復します。

一応`Task.detached`すればこの問題を回避できますが、バックグラウンドでちゃんと実行できるか保証はありませんし、そこまでは検証していません。

## 規約に注意

[ADPLA](https://developer.apple.com/support/terms/apple-developer-program-license-agreement/#j333)でサイドボタンを長押しするApp Intentでは、音声アシスタントを起動しなければならない(must)と書かれています。

なのでこの記事に書かれていることをする場合、

1. まずフォアグラウンドでマイクを開始する
2. バックグラウンドに行ってもマイクは維持するが、音声認識はしない
3. マイク起動中は`supportedModes`を`.background`にする
4. サイドボタンを長押しする
5. アプリは起動せずに音声認識を開始する

みたいな使い方をしないと、ライセンス違反になるかと思います。実際にSide Searchではこういう使い方をしています。

## おわり

Side Button Access自体全然使われていないのに、こんなマニアックな内容の記事に存在価値はあるのか。。
