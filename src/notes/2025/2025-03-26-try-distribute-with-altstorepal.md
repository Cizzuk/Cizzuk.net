---
layout: "post"
lang: "ja"
permalink: "/notes/try-distribute-with-altstorepal/"
canonical: "https://zenn.dev/cizzuk/articles/9636f9dba0acf4"
title: "AltStore PALでアプリを配信してみる"
description: "面白そうだし、せっかくなので記事にしようと思います。"
noindex: true
update: "2025-11-05"
---

**これはZennで公開した記事のミラーです。[現物はこちら]({{ canonical }})**

EUにあるiOS/iPadOSではApp Store以外のアプリストア「代替アプリマーケットプレイス」が利用できるようになっています。日本でも[スマホ競争促進法](https://laws.e-gov.go.jp/law/506AC0000000058/)によって2025年内には使えるようになる~~予定です~~。追記: iOS 26.2 Beta 1で利用可能になりました！やったね！

面白そうなので触りたい。他に触ってる人を日本で見たこともないし、せっかくなので[AltStore PAL](https://faq.altstore.io/altstore-pal/what-is-altstore-pal)に配信するまでの過程を記事にしようと思います。

## 最初に知るべきこと

本題に入る前にいくつか知識を入れておきましょう。**中には金銭に関わるものも含まれるため、試そうと思っている場合は必ず把握しておいた方が良いです。**

1. [AltStore PAL](https://faq.altstore.io/altstore-pal/what-is-altstore-pal)が何なのか知らない人は調べてください。
2. AltStore PALで配信するには、アプリのパッケージと[ソース](https://faq.altstore.io/developers/make-a-source)(リポジトリのようなもの)を自分でホストする必要があります。ソースの書き方はあとで説明します。
3. 代替アプリマーケットプレイスが利用可能な地域からでないと、インストール周りのテストをすることはできませんが、配信は可能です。
4. App Storeに配信しない場合でも、Apple Developer Programに登録する必要があります。もちろん有料です。
5. 代替アプリマーケットプレイスにのみ配信する場合はApp Storeのような厳格な審査はありませんが、Appleによる[公証(Notarization)](https://developer.apple.com/jp/help/app-store-connect/managing-alternative-distribution/submit-for-notarization)は受ける必要があります。
6. [AltStore PALのガイドライン](https://faq.altstore.io/developers/app-guidelines)にも準拠する必要があります。
7. 代替アプリマーケットプレイスで配信をするためには「[EUにおけるアプリに関する新しい規約の付属文書](https://developer.apple.com/contact/request/download/alternate_eu_terms_addendum.pdf)」に同意する必要があります。この規約にはAppleに支払う手数料に関して重大な変更が含まれており、簡単に説明はしますがご自身の責任のもとで本文も確認してください。

### コア技術料(CTF)

これは対象地域におけるアプリのインストール数に応じて課される追加の手数料です。詳しく知りたい場合は付属文書を読むか、サポートページを確認しましょう。

[Core Technology Fee - サポート - Apple Developer](https://developer.apple.com/jp/support/core-technology-fee/)

対象地域に住むユーザーが同じApple Accountで過去1年間でアプリを1回以上インストールした回数を、「初年度アプリインストール数」といいます。これが100万回を超えた場合、それ以降の1インストールごとに€0.50をAppleに支払う必要があります。初年度アプリインストール数の対象になるインストールの種類は以下のページで確認できます。

[初年度アプリインストール数の測定 - App Store Connect - ヘルプ - Apple Developer](https://developer.apple.com/jp/help/app-store-connect/understanding-the-core-technology-fee/measure-your-first-annual-installs)

もしも何かの拍子(SNS等で話題になるなど)で対象地域での総インストール数が100万を突破してしまい、かつ収益が不十分だった場合は損失になります。趣味やOSSのアプリを開発しているデベロッパーにとっては、不必要にリスクを負うことになると思います。

一方で、CTFには以下のように免除される条件もあります。

- 初年度アプリインストール数が100万に満たない場合
- 非営利団体、認定教育機関、政府機関などで、Apple Developer Programの免除を受けている場合
- 全世界で、アプリを通して商業的な収益(有料アプリ、App内課金、サブスク、広告収入、物販などすべて)を得ていない非商業のデベロッパーの場合
- さらに条件を満たす小規模事業者は最大3年間CTFを免除される(ややこしいので詳しくはサポートを読んでください)

一般のデベロッパーでCTFで損害を出したくないのであれば、収益構造についてよく考えるか、アプリからの収益を完全に0にする必要があります。注意すべきなのは、収益を得ているという判定は全世界でされること、すでに収益の一部を徴収されているApp Storeからの収益も含むこと、App内課金などに限らず広告収入やアプリ内の物販なども含むことです。

追記: このCTF、来年2026年にCore Technology Commission (CTC)というものに移行されるようです。CTCへの移行の詳細についてはまだ公表されていませんが、CTFと同様に1インストールごとにかかる料金は存続するようです。

## 「EUにおけるアプリに関する新しい規約の付属文書」に同意する

以下のページで規約に同意できます。

[Alternative Terms Addendum for Apps in the EU - Contact Us - Apple Developer](https://developer.apple.com/contact/request/alternative-eu-terms-addendum/)

ちなみにこれ以降のことは大体[AltStore PALのFAQ](https://faq.altstore.io/developers/distribute-with-altstore-pal)にも書かれています。

## AltStore PALを代替アプリマーケットプレイスに追加する

REST APIを利用してデベロッパーIDとメールアドレスを送信します。

[ADP REST API \| AltStore](https://faq.altstore.io/developers/rest-api#register-developer-id)

[App Store Connectのユーザーとアクセス](https://appstoreconnect.apple.com/access/users)でデベロッパーIDを確認してから、以下のAPIを叩きます。`[Your Apple Developer ID]`と`[Your Email Address]`は書き換えてください。

```bash
curl --header "Content-Type: application/json" \
  -X POST \
  --data '{ 
    "developerID": "[Your Apple Developer ID]", 
    "email": "[Your Email Address]"
  }' \
  https://api.altstore.io/register
```

セキュリティトークンが返ってくるので、それを[App Store Connectのマーケットプレイス](https://appstoreconnect.apple.com/access/integrations/marketplace)で入力します。この時、AltStore PALで配信するアプリも選択します(後から変更可能)。

代替アプリマーケットプレイスへの通知を有効にすると、アプリが審査を通過した際に、各ストア側の処理を自動で開始させることができます。この「ストア側の処理」についてもあとで説明しますが、とりあえず有効にしておいて良いと思います。

## 公証(Notarization)を受ける

前述の通り、App Storeに配信しない場合でもAppleによる審査を受ける必要があります。これはセキュリティチェックのようなもので、ガイドラインはかなり緩和されています。**App Storeにも配信している場合はこの手順をスキップできます。**

[認証に向けた審査申請 - App Store Connect - ヘルプ - Apple Developer](https://developer.apple.com/jp/help/app-store-connect/managing-alternative-distribution/submit-for-notarization)

App Storeにアプリを配信しない場合でも、App Store Connectにアプリを追加して詳細情報を入力する必要があります。この情報はユーザーが設定でオフにしない限りアプリのインストール時に表示されます。この時「レビュータイプ」を「認証」にすることで、代替アプリストア用の審査(公証)に切り替えることができます。

審査を通過すると、そのバージョンに「代替配信パッケージID (ADP ID)」が付与されます(審査履歴から確認できます)。これはあとで使用します。

## 代替配信パッケージをAltStore PALに処理してもらう

パッケージはAppleの審査を通過後、各ストア側でインストール可能な状態に処理してもらう必要があります。AltStoreでのやり方は以下のページにも書いてあります。

[ADP REST API \| AltStore](https://faq.altstore.io/developers/adp-rest-api#download-adp)

以下のAPIを叩くと、パッケージの処理を手動で開始できます。`[Your ADP ID]`のところに前述の代替配信パッケージIDを入力します。代替アプリマーケットプレイスへの通知を有効にした場合、以降は自動で処理が開始されるのでこの手順はスキップできるようになります。

```bash
curl --header "Content-Type: application/json" \
  -X POST \
  --data '{ "adpID": "[Your ADP ID]" }' \
  https://api.altstore.io/adps
```

アプリのサイズにもよるかもしれませんが概ね3-5分くらいで処理が完了するので、以下のAPIでパッケージのダウンロードリンクを取得します。

```bash
curl -X GET https://api.altstore.io/adps/[Your ADP ID] 
```

`status`が`success`になっていれば処理が完了しているため、`downloadURL`をブラウザ等に入力すればパッケージの入ったZipファイルをダウンロードできます。(Macのターミナルからブラウザの検索窓に直接コピペすると、エスケープのせいで正しくアクセスできないので注意(1敗))

ダウンロードしたパッケージは自分でホストする必要があります。ダウンロードしたZipファイルを展開して、ディレクトリの構造を変更せずにそのままWeb上に公開します。HTTPSでダウンロードできる状態にしておく必要があります。

## ソースを作る

AltStore PALの前身、AltStore Classic時代からあるもので、パッケージマネージャーのソース(リポジトリ)と同じような感じです。

[Make a Source \| AltStore](https://faq.altstore.io/developers/make-a-source)

私のソースも参考適度に覗いてみてください: [https://i.cizzuk.net/altstore/source.pal.json](https://i.cizzuk.net/altstore/source.pal.json)

また、ソース内のアプリは[Patreon](https://www.patreon.com)と連携させて、パトロンだけがインストールできるようにすることができます。CTFの財源を確保したい場合に便利な機能だと思います。この記事では紹介しないので、[公式のドキュメント](https://faq.altstore.io/developers/make-a-source#patreon)を参考に設定してください。

### ソースのメタデータ

ソースはJSON形式です。以下はサンプルです。

```json
{
  "name": "My Example Source",
  "subtitle": "A source for all of my apps",
  "description": "Welcome to my source! Here you'll find all of my apps.",
  "iconURL": "https://example.com/source_icon.png",
  "headerURL": "https://example.com/source_header.png",
  "website": "https://example.com",
  "tintColor": "#F54F32",
  "featuredApps": [
    "com.example.myapp",
    "com.example.anotherapp"
  ],
  "apps": [],
  "news": []
}
```

`name`と`apps`以外はすべてオプションです。

- `name`: ソースの名前を入れます。
- `subtitle`: サブタイトルで、名前の下に表示されます。
- `description`: ソースの説明文で、ソースの最下部に表示されます。URLを入れることもできます。
- `iconURL`: ソースのアイコンです。視認性のために設定することをおすすめします。設定しない場合は最初のアプリがアイコンになります。
- `headerURL`: ヘッダーです。UIの設計上ほとんど見えません。設定しない場合はアイコンになります。
- `website`: サブタイトルの下に表示されるリンクです。
- `tintColor`: ソースのテーマカラーで16進数のカラーコードを入力します。文字などにも使用されるので見やすい色にしましょう。
- `featuredApps`: おすすめのアプリを最大5つ設定できます。ソースの目立つところに表示されます。
- `apps`: このあと説明します。
- `news`: この記事では割愛します。

### アプリを追加

`apps`の中は以下のような感じで、配信しているアプリの配列になります。

```json
"apps": [
    {
        "name": "My Example App",
        "bundleIdentifier": "com.example.myapp",
        "marketplaceID": "12345678",
        "developerName": "Example Developer",
        "subtitle": "An awesome app.",
        "localizedDescription": "This is an awesome app only available on AltStore.",
        "iconURL": "https://example.com/myapp_icon.png",
        "tintColor": "#F54F32",
        "category": "utilities",
        "screenshots": [
            "https://example.com/myapp_screenshot1.png",
            "https://example.com/myapp_screenshot2.png",
            "https://example.com/myapp_screenshot3.png"
        ],
        "versions": [],
        "appPermissions": {
            "entitlements": [
                "com.apple.security.application-groups",
                "com.apple.developer.siri"
            ],
            "privacy": {
                "NSMicrophoneUsageDescription": "App uses the microphone to record audio.",
                "NSCameraUsageDescription": "App uses the camera to take photos."
            }
        }
    }
]
```

ソースのメタデータとかぶっているものは省略します。

- `bundleIdentifier`: アプリのBundleIDです。`Info.plist`の`CFBundleIdentifier`とかXcodeのプロジェクトの設定で確認できます。
- `marketplaceID`: App Store Connectの「App情報」から確認できるApple IDです。
- `developerName`: 開発者の名前です。OSSでたくさんの人が関わっている時などは「[開発者名] & Various Contributors」と書くことが多いです。
- `localizedDescription`: アプリの説明です。URLを入れることもできます。
- `category`: オプションで、以下の中のどれかひとつのカテゴリを設定します。
  - `developer`
  - `entertainment`
  - `games`
  - `lifestyle`
  - `other`
  - `photo-video`
  - `social`
  - `utilities`
- `screenshots`: オプションで、例のように簡単に設定することもできますが、iPad向けに別の画像を用意したり横向きの画像を設定することもできます。詳しくは[公式のドキュメント](https://faq.altstore.io/developers/make-a-source#screenshots)を参考にしてください。
- `versions`: このあと説明します。
- `appPermissions`: アプリのEntitlementsとプライバシーに関する情報を入力します。以下2つのEntitlementsはすべてのアプリに必ず含まれるものであるため省略できます。そのほかは必須です。EntitlementsはApp Store Connectでビルドのメタデータから確認することができます。
  - `com.app.developer.team-identifier`
  - `application-identifier`

### バージョンを追加

最後にバージョンを追加します。初回リリースとアップデートの管理に利用します。

```json
"versions": [
  {
    "version": "1.0",
    "buildVersion": "60",
    "date": "2023-03-30",
    "localizedDescription": "First AltStore release!",
    "downloadURL": "https://example.com/adp/b3177aba-0596-461c-8460-fbfffca3d270/",
    "size": 79821,
    "minOSVersion": "17.4"
  }
]
```

アップデートを配信するたびに、配列に要素を追加します。**新しいバージョンは配列の先頭に追加してください。**

- `version`と`buildVersion`: `Info.plist`に書かれているものと同じバージョンとビルド番号をそれぞれ記載します。基本的に両方がユーザーに表示されますが、`marketingVersion`を設定すると好きな文字列に表示上は変更できます。
- `date`: バージョンを公開した日付をISO 8601フォーマットで記述します。
- `downloadURL`: 自身でホストしている代替配信パッケージへのURLを入力します。
- `size`: アプリのサイズです。ユーザーの環境によってサイズが異なってしまうため正確でなくてもOKです。App Store Connectでビルドのメタデータから確認することができます。
- `minOSVersion`: オプションで、iOS/iPadOSの最小要件です。AltStoreは非対応バージョンを非表示にするので設定すべきです。

これでソースが完成したので、Web上にホストしてHTTPSでダウンロードできるようにします。

## 最後にユーザーにソースを公開する

完成したソースのURLをユーザーに公開すれば、ユーザーがアプリをダウンロードできるようになります。

ソースを登録してもらう方法には、AltStore PALアプリ内のSourcesタブからURLを入力してもらうか、次の「おまけ」に書いてあるURLスキームを使う方法があります。

以上です。お疲れ様でした。

---

## おまけ: AltStore PALのURLスキーム

ソースのURLをそのまま公開すると、ユーザー視点ではいきなりJSONファイルを見せられて意味不明な状態になります。

AltStore PALを自動で開くURLスキームがあるので紹介しておきます。

スキームは`altstore-pal://`で、パスは`source`、クエリの`url`にソースのURLを入れてあげれば完成です。以下のような感じになります。

```
altstore-pal://source?url=https://i.cizzuk.net/altstore/source.pal.json
```

## おまけ2: アプリの説明の翻訳

公式のドキュメントには書いてませんが、Epic Gamesが利用していたので紹介します。

ソースの`localizedDescription`は`_localizedDescriptions`というキーを使うとローカライズできます。

```json
"apps": [
    {
        "name": "My Example App",
        "localizedDescription": "Example Description",
        "_localizedDescriptions": {
            "en": "Example Description",
            "ja": "説明の例"
        },
        
        ...
    }
]
```

随筆時点ではAltStore PALは英語以外には非対応なのですが、デバイスの言語設定に合わせてこれらの翻訳が使われるようになります。

アプリ名やスクリーンショットもローカライズできるのかは不明です。

## おまけ3: AltStore公式Mastodonにソースを登録する

[explore.alt.store](https://explore.alt.store)という、AltStoreが運営しているMastodonインスタンスがあります。

このインスタンスで、自分のソース内のアプリのアップデートやニュースを配信してくれるBotを作成することができます。ただし、自分で直接ログインをしたり投稿をすることはできません。あくまでAltStoreの管轄で自動管理されるものになります。

先にソースに変更を加えます。ソースに`fediUsername`というキーを追加します。

```json
{
  "name": "My Example Source",
  "fediUsername": "example",

  ...
}
```

これはexplore.alt.store上でのユーザー名になります。例えば`example`なら`@example@alt.store`といった具合です。ActivityPubの仕様上、**これは後から変更できません。**

ソースを更新したら、以下のAPIを叩きます。`[YOUR SOURCE URL]`のところにソースのURLを入れます。

```bash
curl --header "Content-Type: application/json" \
  -X POST \
  --data '{  
    "source": "[YOUR SOURCE URL]"
  }' \
  https://api.altstore.io/federate
```

しばらくするとアカウントが作成され、今までのアップデート履歴やニュースも含めて投稿され始めます。
