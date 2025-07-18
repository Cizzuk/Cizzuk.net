# Cizzuk.net

私のWebサイトのソースコードです。Jekyllを利用していますが、ビルドにはNode.jsも使用します。

Jekyllでは[Polyglot](https://github.com/untra/polyglot)を利用してローカライズに対応させています。

Node.jsで実行するビルドスクリプトはTypescriptで書かれています。

## Install

Ruby, RubyGem, Jekyll, Node.js, npmがそれぞれ利用できる環境である必要があります。

```bash
npm install; bundle install
```

## Build

以下のコマンドで`./_site/`以下に静的Webサイトがビルドされます。

Cloudflare Pagesで使用することを想定しています。

```bash
npm run build
```

## 特殊な仕様

### Polyglotの利用方法

ローカライズにあたって、ルート直下のディレクトリの名前は言語コードにしています。例えば`https://cizzuk.net/ja/`といった形です。

言語コードでないディレクトリの下に正式なページは存在しません。例えば`https://cizzuk.net/app/`は文書ではなく、ブラウザの設定言語に合わせて自動で`https://cizzuk.net/ja/app/`や`https://cizzuk.net/en/app/`にリダイレクトさせるスクリプトがあります。

これをするために、Jekyllのデフォルトの言語は`no-default`というカスタム言語に設定されています。Polyglotの仕様でデフォルトの言語のページはルート直下に配置されてしまうためです。

Liquidを用いて、ページの言語が`no-default`の場合はページのcontentではなくリダイレクトページが生成されるように設計されています。

### ビルドスクリプト

ビルドスクリプトはNode.jsで実行されます。単にRubyでJekyllのPluginを使うよりも慣れていて楽だったためです。

1. 最初にJekyllでビルドを実行します。その後に`./_site/`以下のファイルに変更を加えます。
2. HTML, XML, JavaScriptのMinifyをします。(スタイルシートはSCSSのコンパイル時にJekyllでMinifyされます)
3. 画像やCSSなどのリソースをCDNのキャッシュに最適化させるために、CRC32ハッシュをファイル名に含めるようにします。この時HTML上のリンクなども自動で書き換えて、`_redirect`に元のファイル名からの302リダイレクトも追加します。
4. 最後にJekyllで生成されてしまった不要なファイルなどを消します。`no-default`に不要な.atomファイルが生成されたりするので削除します。

## License

Copyright (c) 2020 Cizzuk All Rights Reserved.
