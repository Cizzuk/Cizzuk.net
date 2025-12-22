---
layout: "post"
lang: "ja"
permalink: "/notes/launch-app-from-cameracontrol/"
canonical: "https://zenn.dev/cizzuk/articles/2d647a606a12a2"
title: "カメラコントロールからアプリを起動できるようにする"
description: "iPhoneのカメラコントロールから自身のアプリを起動できるようにするための設定とコードを解説します。"
noindex: true
---

**これはZennで公開した記事のミラーです。[現物はこちら]({{ canonical }})**

iPhoneに搭載されているカメラコントロールは、クリックするとあらかじめ設定で選択していたカメラアプリを起動することができます。ここで選択できるアプリは対応するサードパーティアプリも含まれます。

そこで[CBNote](https://github.com/Cizzuk/CBNote)というアプリを作りました。カメラコントロールから起動できるノートアプリです。カメラアプリじゃないので一見すると脱法アプリのようですが審査に通ったので合法です。

このアプリを作るにあたってカメラコントロール周りの実装や設定を行ったのですが、思ったより引っかかりやすい部分が多かったため記事に残しておこうと思います。

目標は、iPhoneのカメラコントロールの設定内の起動するカメラアプリの選択肢に自分のアプリが表示されるようにし、カメラコントロールから起動できるようにすることです。

## 要件チェック

まずSimulatorがカメラにもカメラコントロールにも対応していないため、カメラコントロールを搭載した実機のiPhoneがあった方が良いです。ただ、全く同じ動きをするコントロールをコントロールセンターやショートカットに追加できるのでなくてもテストはできます。

### アプリの要件

ざっくり以下が必要です。

- カメラアクセスの権限
- カメラを使用する何らかの機能
- LockedCameraCaptureExtension
- カメラコントロールからの起動のハンドリング

まず大前提としてカメラアクセスの権限が必要です。そうなればアプリは必然的にカメラを使用する機能を持っている必要があります。カメラを使用しないのにアクセス権を求めると審査でリジェクトされてしまうためです。

それから、[LockedCameraCapture](https://developer.apple.com/documentation/LockedCameraCapture)に対応させる必要があります。これはデバイスがロックされた状態でも利用できるカメラのExtensionで、ロック中にコントロールセンターやカメラコントロールから起動します。アンロック中にコントロールを使用すると本体のアプリが起動します。実はカメラコントロールから起動する機能はこのExtensionの一部なんですね。

また、アプリがカメラコントロールから起動されたときは、必ず適切な設定でカメラを使用する必要があります。カメラが使用されていないと判断された場合、10秒後にシステムによって強制終了されます。

## ExtensionとIntentを作成する

### LockedCameraCaptureExtensionを追加する

Xcode上で File → New → Target... からCapture Extensionのテンプレートを使用してターゲットを追加します。

![Xcode上の新しいターゲットのテンプレートを選択する画面。Capture Extensionが選択されている。](/assets/notes/launch-app-from-cameracontrol/1.png)

### 起動用のIntentを設定する

システムにカメラを使用するアクティビティが利用可能であることを知らせるために、[CameraCaptureIntent](https://developer.apple.com/documentation/appintents/cameracaptureintent)を追加します。

プロジェクトに適当なSwiftファイルを追加して、以下のようなコードを書いてみましょう。

```swift
import AppIntents

struct CaptureIntent: CameraCaptureIntent {
    static let title: LocalizedStringResource = "CaptureIntent"
    static var isDiscoverable: Bool = false

    @MainActor
    func perform() async throws -> some IntentResult {
        return .result()
    }
}
```

`isDiscoverable`を`false`に設定すると、ショートカットアプリにこのIntentが表示されなくなります。

Target Membershipにはアプリ本体とExtensionの両方を追加します。

## カメラアクセスを求める

本体のアプリとLockedCameraCaptureExtensionの**両方の**Info.plistに、`NSCameraUsageDescription`を追加します。説明もちゃんと設定してください。

その後、本体のアプリのどこかでアクセスをリクエストしましょう。

```swift
AVCaptureDevice.requestAccess(for: .video) { _ in }
```

### 設定を確認する

iOSの 設定 → カメラ → カメラコントロール → カメラを起動 の中に今回作成したアプリがリストされているはずです。もし無ければ何かしらの設定を間違えています。

選択した状態でカメラコントロールを押すとアプリが起動するはずです。

![iPhoneの設定内の「カメラを起動」の画面。デモアプリが選択されている。](/assets/notes/launch-app-from-cameracontrol/2.png)

## カメラコントロールからの起動をハンドリング

現在の状態でカメラコントロールをクリックすると以下のようになっていることがわかります。

- ロック画面(あるいは通知センター)ではLockedCameraCaptureExtensionが起動する。
- それ以外の画面では本体のアプリが起動する。

重要なのは、「ロック画面」というのはデバイスが「ロックされている」こととは関係なく、認証ができていてもロック画面にいるならLockedCameraCaptureExtensionが起動します。

またどちらの場合でも起動してからカメラが使用されていないと判断された場合、10秒後にシステムによって強制終了されます。

### ロック画面のハンドリング

ロック画面にいる場合、LockedCameraCaptureExtensionが起動します。テンプレートの初期状態だと、UIImagePickerControllerによるカメラが表示されるようになっています。

LockedCameraCaptureExtensionはセキュリティとプライバシーのために、インターネット接続ができない、App Groupの共有コンテナで読み書きできない等の制限があります。そのため撮影した写真は[PhotoKit](https://developer.apple.com/documentation/PhotoKit)か[session](https://developer.apple.com/documentation/lockedcameracapture/lockedcameracapturesession/sessioncontenturl)を使用して保存することになります。[AppContext](https://developer.apple.com/documentation/appintents/cameracaptureintent/appcontext-swift.associatedtype)を使用して最大4KBまでカメラの設定に関するデータをアプリから受け取ることもできます。

また、Extensionから[本体のアプリを開く](https://developer.apple.com/documentation/LockedCameraCapture/Creating-a-camera-experience-for-the-Lock-Screen#Launch-your-app-from-the-capture-extension)こともできます。デバイスがロックされている場合はユーザーにロック解除を促します。

LockedCameraCaptureExtension自体の実装は記事の本筋から少し離れてしまうため、細かい部分は割愛します。(めんどくさい)

### アプリが開かれた時のハンドリング

現在の状態でもアプリは起動してくれますが、このままでは起動から10秒後に強制終了してしまいます。そのため、カメラコントロールから起動されたことを認識し、カメラを使用する必要があります。

AppIntentsの利用経験がある方なら察しがついていると思いますが、カメラコントロールから起動した際にはCameraCaptureIntentの`perform()`が実行されます。

私がCBNoteで採用した実装は[NotificationCenter](https://developer.apple.com/documentation/foundation/notificationcenter)を利用するものです。一番簡単に実装できる方法だと思います。

CameraCaptureIntentのコードを以下のように変更してみましょう。

```swift
import AppIntents

// 追加: Notificationを定義する
extension Notification.Name {
    static let cameraControlDidActivate = Notification.Name("cameraControlDidActivate")
}

struct CaptureIntent: CameraCaptureIntent {
    static let title: LocalizedStringResource = "CaptureIntent"
    static var isDiscoverable: Bool = false

    @MainActor
    func perform() async throws -> some IntentResult {
        // 追加: Notificationを送信
        NotificationCenter.default.post(name: .cameraControlDidActivate, object: nil)
        return .result()
    }
}
```

まずcameraControlDidActivateという名前のNotificationを追加しました。それから`perform()`が実行されたときにcameraControlDidActivateが送信されるようにしています。

このNotificationを受け取ったらカメラを使用する処理を実行するようにします。SwiftUIでは以下の例ようにレシーバーを簡単に設定できます。

```swift
ContentView()
    .onReceive(NotificationCenter.default.publisher(for: .cameraControlDidActivate)) { _ in
        // TODO: ここにカメラを開く何らかの処理を書く
    }
```

### 独自のカメラを実装した際の注意

AVFoundation等を利用して独自にカメラを実装していた場合、音量ボタンやカメラコントロールなどの物理ボタンによる撮影をサポートしないと、適切にカメラが使用されていないとみなされて強制終了してしまいます。

SwiftUIでは以下の例のように`.onCameraCaptureEvent()`を追加して簡単に実装できます。

```swift
CameraPreview(session: session)
    .onCameraCaptureEvent() { event in
        if event.phase == .began {
            // TODO: ここで撮影処理
        }
    }
```

## おわり

今回の記事に沿ったデモのアプリをGitHub上で公開しています。クローンしてTeamを設定すれば、すぐにビルドして試すことができます。[Appleのカメラアプリのサンプル](https://developer.apple.com/documentation/avfoundation/avcam-building-a-camera-app)もかなり参考になりますが、こちらの方がコードの量が圧倒的に少ないので見やすいと思います。両方参考にするのが良いですね。

[Cizzuk/OpenFromCameraControllDemo: カメラコントロールからアプリを起動するデモプロジェクト](https://github.com/Cizzuk/OpenFromCameraControllDemo)

またCBNoteでは、カメラコントロールから起動したときもシステムによる強制終了を免れながら、カメラ起動以外の他の機能に置き換える設定を提供しています。しかもApp Storeの審査で承認されています。ただこの記事で推奨したり解説するのは気が引けるので、実装したい場合は[CBNoteのソースコード](https://github.com/Cizzuk/CBNote)を読むか、独自で強制終了の回避策を考えて実装してください。

以上でこの記事の解説はおしまいです。
