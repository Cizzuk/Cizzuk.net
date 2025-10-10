---
layout: "post"
lang: "ja"
permalink: "/notes/try-distribute-with-altstorepal/"
canonical: "https://zenn.dev/cizzuk/articles/9636f9dba0acf4"
title: "AltStore PALでアプリを配信してみる"
description: "面白そうだし、せっかくなので記事にしようと思います。"
noindex: true
update: "2025-10-10"
---

**これはZennで公開した記事のミラーです。[現物はこちら]({{ canonical }})**

EUにあるiOS/iPadOSではApp Store以外のアプリストア「代替アプリマーケットプレイス」が利用できるようになっています。日本でも[スマホ競争促進法](https://laws.e-gov.go.jp/law/506AC0000000058/)によって2025年内には使えるようになる予定です。

面白そうなので触りたい。他に触ってる人を日本で見たこともないし、せっかくなので[AltStore PAL](https://faq.altstore.io/altstore-pal/what-is-altstore-pal)に配信するまでの過程を記事にしようと思います。

## 最初に知るべきこと

本題に入る前にいくつか知識を入れておきましょう。**中には金銭に関わるものの含まれるため、試そうと思っている場合は必ず把握しておいた方が良いです。**

1. [AltStore PAL](https://faq.altstore.io/altstore-pal/what-is-altstore-pal)が何なのか知らない人は調べてください。
2. AltStore PALで配信するには、アプリのパッケージと[ソース](https://faq.altstore.io/developers/make-a-source)(リポジトリのようなもの)を自分でホストする必要があります。ソースの書き方はあとで説明します。
3. 代替アプリマーケットプレイスが利用可能な地域からでないと、直接インストール周りのテストをすることはできません(配信は可能です)。
4. App Storeに配信しない場合でも、Apple Developer Programに登録する必要があります。もちろん有料です。
5. 代替アプリマーケットプレイスにのみ配信する場合はApp Storeのような厳格な審査はありませんが、Appleによる[公証(Notarization)](https://developer.apple.com/jp/help/app-store-connect/distributing-apps-in-the-european-union/submit-for-notarization/)は受ける必要があります。
6. 代替アプリマーケットプレイスで配信をするためには「[EUにおけるアプリに関する新しい規約の付属文書](https://developer.apple.com/contact/request/download/alternate_eu_terms_addendum.pdf)」に同意する必要があります。この規約にはAppleに支払う手数料に関して重大な変更が含まれており、簡単に説明はしますがご自身の責任のもとで本文も確認してください。

### コア技術料(CTF)

これは対象地域におけるアプリのインストール数に応じて課される追加の手数料です。詳しく知りたい場合は付属文書を読むか、サポートページを確認しましょう。

[Core Technology Fee - サポート - Apple Developer](https://developer.apple.com/jp/support/core-technology-fee/)

対象地域に住むユーザーが同じApple Accountで過去1年間でアプリを1回以上インストールした回数を、「年間初回インストール」といいます。これが100万回を超えた場合、それ以降の1インストールごとに€0.50をAppleに支払う必要があります。年間初回インストールの対象になるインストールの種類は以下のページで確認できます。

[年間初回インストールの種類 - 欧州連合 (EU) でのアプリ配信 - App Store Connect - ヘルプ - Apple Developer](https://developer.apple.com/jp/help/app-store-connect/distributing-apps-in-the-european-union/first-annual-install-types)

もしも何かの拍子(SNS等で話題になるなど)で対象地域での総インストール数が100万を突破してしまい、かつ収益が不十分だった場合は損失になります。趣味やOSSのアプリを開発しているデベロッパーにとっては、不必要にリスクを負うことになると思います。

一方で、CTFには以下のように免除される条件もあります。

- 年間初回インストールが100万に満たない場合
- 非営利団体、認定教育機関、政府機関などで、Apple Developer Programの免除を受けている場合
- 全世界で、アプリを通して商業的な収益(有料アプリ、App内課金、サブスク、広告収入、物販などすべて)を得ていない非商業のデベロッパーの場合
- さらに条件を満たす小規模事業者は最大3年間CTFを免除される(ややこしいので詳しくはサポートを読んでください)

一般のデベロッパーであれば、CTFを支払わなくて済む方法で配信をしたいのであれば、アプリからの収益は完全に0にする必要があります。注意すべきなのは、収益を得ているという判定は全世界でされること、すでに収益の一部を徴収されているApp Storeからの収益も含むこと、App内課金などに限らず広告収入やアプリ内の物販なども含むことです。

追記: このCTF、来年2026年にCore Technology Commission (CTC)というものに移行されるようです。CTCへの移行の詳細についてはまだ公表されていませんが、CTFと同様に1インストールごとにかかる料金は存続するようです。

## 「EUにおけるアプリに関する新しい規約の付属文書」に同意する

以下のページで規約に同意できます。

[Alternative Terms Addendum for Apps in the EU - Contact Us - Apple Developer](https://developer.apple.com/contact/request/alternative-eu-terms-addendum/)

ちなみにこれ以降のことは大体[AltStore PALのFAQ](https://faq.altstore.io/developers/distribute-with-altstore-pal)にも書かれています。

## AltStore PALを代替アプリマーケットプレイスに追加する

REST APIを利用してデベロッパーIDとメールアドレスを送信します。

[ADP REST API \| AltStore](https://faq.altstore.io/developers/rest-api#register-developer-id)

[App Store Connect](https://appstoreconnect.apple.com/access/users)でデベロッパーIDを確認してから、以下のコマンドを実行します。

```bash
curl --header "Content-Type: application/json" \
  -X POST \
  --data '{ 
    "developerID": "[Your Apple Developer ID]", 
    "email": "[Your Email Address]"
  }' \
  https://api.altstore.io/register
```

受け取ったセキュリティトークンを[App Store Connect](https://appstoreconnect.apple.com/access/integrations/marketplace)で入力します。この時、代替アプリマーケットプレイスで配信するアプリも選択します(後から変更可能)。

代替アプリマーケットプレイスへの通知を有効にすると、アプリが審査を通過した時に後で紹介する各ストア側の処理を自動で開始させることができます。この「ストア側の処理」についてもあとで説明しますが、とりあえず有効にしておいて良いと思います。

## 公証(Notarization)を受ける

前述の通り、App Storeに配信しない場合でもAppleによる審査を受ける必要がありますが、ガイドラインはかなり緩和されています。**App Storeにも配信している場合はこの手順をスキップできます。**

[認証に向けた審査申請 - 欧州連合 (EU) でのアプリ配信 - App Store Connect - ヘルプ - Apple Developer](https://developer.apple.com/jp/help/app-store-connect/distributing-apps-in-the-european-union/submit-for-notarization)

App Storeにアプリを配信しない場合でも、いままでと同じようにApp Store Connectにアプリを追加して詳細情報を入力します。このとき「レビュータイプ」を「認証」にすることで、代替アプリストア専用の審査に切り替えることができます。

審査を通過すると、そのバージョンには「代替配信パッケージID」が付与されます。これはあとで使用します。

## 代替配信パッケージをAltStore PALに処理してもらう

アプリはAppleに加えて各ストア側でも処理してもらう必要があります。AltStoreでのやり方は以下のページにも書いてありますが、一応説明しようと思います。

[ADP REST API \| AltStore](https://faq.altstore.io/developers/adp-rest-api#download-adp)

以下の手順でパッケージの処理を手動で開始します。(App Store Connectで代替アプリマーケットプレイスを追加する際に、審査通過後に自動で処理を開始するように設定できます。)

`curl`が使えるシェルで以下のコマンドを実行します。

```bash
curl --header "Content-Type: application/json" \
  -X POST \
  --data '{ "adpID": "[Your ADP ID]" }' \
  https://api.altstore.io/adps
```

`[Your ADP ID]`のところに前述の代替配信パッケージIDを入力します。

アプリのサイズにもよるかもしれませんが概ね3-5分くらいで処理が完了するので、以下のコマンドでパッケージのダウンロードリンクを取得します。

```bash
curl -X GET https://api.altstore.io/adps/[Your ADP ID] 
```

`status`が`success`になっていれば処理が完了しているため、`downloadURL`をブラウザ等に入力すればパッケージをダウンロードできます。(Macのターミナルからブラウザの検索窓に直接コピペすると、エスケープのせいで正しくアクセスできないので注意)

ダウンロードしたパッケージは別の場所で自分でホストする必要があります。Zipファイルを展開して、ディレクトリの構造を変更せずにそのままWeb上に公開します。HTTPSでダウンロードできる状態にしておいてください。

## ソースを作る

AltStore PALの前身、AltStore Classic時代からあるもので、パッケージマネージャーのソース(リポジトリ)と同じような感じです。公式のドキュメントも紹介しておきます。

[Make a Source \| AltStore](https://faq.altstore.io/developers/make-a-source)

あと私のソースも参考適度に覗いてみてください: [https://i.cizzuk.net/altstore/source.pal.json](https://i.cizzuk.net/altstore/source.pal.json)

### ソースのメタデータ

ソースはJSON形式です。ベースを作ってみましょう。

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

- `name`にはソースの名前を入れます。
- `subtitle`はサブタイトルで、名前の下に表示されます。
- `description`はソースの説明文で、ソースの最下部に表示されます。URLを入れることもできます。
- `iconURL`はオプションですが、視認性のために設定することをおすすめします。設定しない場合は最初のアプリがアイコンになります。
- `headerURL`はヘッダーです。ユーザーの操作がない限りぼかされていてほとんど見ることはありません。設定しない場合はアイコンになります。
- `website`はサブタイトルの下に表示されるリンクです。
- `tintColor`はソースのテーマカラーで16進数のカラーコードを入力します。見やすい色にしましょう。
- `featuredApps`はおすすめのアプリで最大5つ設定できます。ソースの目立つところに表示されます。
- `apps`はこのあと説明します。`news`は割愛します。

### アプリを追加

`apps`内は以下のような感じです。

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

先に紹介したものは省略します。

- `bundleIdentifier`はアプリのBundleIDです。`Info.plist`の`CFBundleIdentifier`とかXcodeのプロジェクトの設定で確認できます。
- `marketplaceID`はApp Store ConnectのApp情報から確認できるApple IDです。
- `developerName`は開発者の名前です。OSSでたくさんの人が関わっている時などは「[開発者名] & Various Contributors」と書くことも多いです。
- `localizedDescription`はアプリの説明です。URLを入れることもできます。
- `category`はオプションで、以下の中のどれかひとつのカテゴリを設定します。
  - `developer`
  - `entertainment`
  - `games`
  - `lifestyle`
  - `other`
  - `photo-video`
  - `social`
  - `utilities`
- `screenshots`はオプションで、例のように簡単に設定することもできますが、iPad向けに別の画像を用意したり横向きの画像を設定することもできます。詳しくは[公式のドキュメント](https://faq.altstore.io/developers/make-a-source#screenshots)を参考にしてください。
- `versions`はこのあと説明します。
- `appPermissions`にはアプリのEntitlementsとプライバシーに関する情報を入力します。以下2つのEntitlementsはすべてのアプリに必ず含まれるものであるため省略できます。そのほかは必須です。EntitlementsはApp Store Connectでビルドのメタデータから確認することができます。
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
    "downloadURL": "https://example.com/adp",
    "size": 79821,
    "minOSVersion": "17.4"
  }
]
```

アップデートを配信するたびに、配列に要素を追加します。**新しいバージョンは配列の先頭に追加してください。**

- `version`と`buildVersion`には`Info.plist`に書かれているものと同じバージョンとビルド番号をそれぞれ記載します。基本的に両方がユーザーに表示されますが、`marketingVersion`を設定すると好きな文字列に表示上は変更できます。
- `date`はバージョンを公開した日付をISO 8601フォーマットで記述します。
- `downloadURL`は代替配信パッケージへのURLを入力します。
- `size`はアプリのサイズです。ユーザーの環境によってサイズが異なってしまうため正確にはなりません。Xcodeから出力したipaファイルのサイズとかApp Storeに記載されているサイズとかで良いと思います。単位は1バイトです。
- `minOSVersion`はオプションで、iOS/iPadOSの最小要件です。AltStoreは非対応バージョンを非表示にするので設定すべきです。
- `maxOSVersion`もオプションで追加できます。iOS/iPadOSの上限です。Classic時代の名残で、ほとんどのアプリには必要ないはずです。

これでソースは完成したので、Web上にホストしてHTTPSでダウンロードできるようにします。

完成したソースのURLをユーザーに公開すれば、アプリをダウンロードできるようになります。

## おまけ: AltStore PALのURLスキーム

ソースのURLをそのまま公開すると、ユーザー視点ではいきなりJSONファイルを見せられて意味不明な状態になります。以下は私のソースです。

[https://i.cizzuk.net/altstore/source.pal.json](https://i.cizzuk.net/altstore/source.pal.json)

セキュリティ的に若干微妙ではありますが、AltStore PALを自動で開くURLスキームがあるので紹介しておきます。

スキームは`altstore-pal://`で、パスは`source`、クエリの`url`にソースのURLを入れてあげれば完成です。以下のような感じになります。

```
altstore-pal://source?url=https://i.cizzuk.net/altstore/source.pal.json
```

---

- 2025/04/20 修正: AltStoreからセキュリティトークンを受け取る方法が変更されたため編集しました。
- 2025/08/17 修正
- 2025/09/07 更新
- 2025/10/10 更新: 一部の文言や表現を変更しました。AltStore Classicでのテストに関する部分を削除しました。
