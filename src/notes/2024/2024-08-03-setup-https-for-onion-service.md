---
layout: "post"
lang: "ja"
permalink: "/notes/setup-https-for-onion-service/"
description: ".onionドメインのWebサイトでHTTPSを利用できるようにする方法を書きました。"
title: "Onion ServiceのWebサイトをHTTPSに対応させる"
---

[Onion Service](https://community.torproject.org/onion-services/)は、HTTPSを利用しなくても通信は暗号化されていますし、[.onionドメイン自体が公開鍵](https://blog.torproject.org/v3-onion-services-usage/)であるため、通信先のサーバーが本物であることも保証されています。  

一方で、Onion ServiceはTorクライアント同士の通信のみ暗号化しています。真にE2EEであるためには、Onion Serviceを実行しているサーバーとWebサイトのサーバーが同一であり、かつ閲覧者のTorクライアントとブラウザが同じ機器で動作している必要があります。

例えばTorルーターを使用している閲覧者が、Wi-Fiで接続したデバイスからOnion ServiceのWebサイトを閲覧する場合、ルーターで一度復号された通信がデバイスに転送されるため、E2EEは成立しません。Wi-Fiのパスワードが漏洩していたりすると、攻撃者は通信内容を盗聴できる可能性があるわけです。

## 証明書の入手

残念ながら、記事作成時点ではLet's Encryptは.onionドメインに対応していません。それどころか、対応しているCAは以下の2つしかなく、いずれも有料です。

- [Digicert](https://www.digicert.com/)
- [HARICA](https://harica.gr/)

Digicertは組織向けのEV証明書を発行するので非常に高価です。なので特に個人の場合はHARICAでDV証明書を取得することになります。

なお、暗号通貨による支払いは不可能なため、HTTPS対応をすれば、Webサイトの運営者の身元は司法機関によって特定される可能性があります。(特にHARICAはギリシャのCAなのでEU圏内です)

各サービスから証明書を購入する方法は、それぞれ丁寧に説明してくれているので割愛します。

- [Ordering a .Onion Certificate from DigiCert &#124; DigiCert.com](https://www.digicert.com/blog/ordering-a-onion-certificate-from-digicert)
- [Request for Domain Validated (DV) &#124; HARICA - Guides](https://guides.harica.gr/docs/Guides/Server-Certificate/Request-for-Domain-Validated-DV/)

## 証明書を設定

.onionのWebサイトでもtorrcを少し編集すれば、あとは通常のものとほぼ同じように証明書を設定できます。

以下ではHARICAから入手した証明書をNginxで設定する例を示します。

まずtorrcを以下のように少し変更して、HTTPS用のポートを設定します。  
これはNginx側が認識するための仮のローカルのポートです。  
**Onion Serviceではポート解放をする必要はありません。**

```
HiddenServiceDir /etc/tor/hidden_service/
HiddenServicePort 80 127.0.0.1:80
HiddenServicePort 443 127.0.0.1:443
```

次にHARICAから**PKCS#7 (chain)**の証明書をダウンロードして、これをPEM形式に変換します。

```bash
$ openssl pkcs7 -print_certs -in Cert_chain.p7b -out onion.pem
```

続いてNginxの設定ファイルを以下のように設定します。

```conf
server {
    listen 443 ssl;

    server_name examplexxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxd.onion;
    
    ssl_certificate /etc/nginx/cert/onion.pem;
    ssl_certificate_key /etc/nginx/cert/onion.key;
}
```

`listen`には先ほどtorrcで設定したSSL用のポート(ここでは443)を指定します。

`ssl_certificate`と`ssl_certificate_key`には先ほど変換したPEM形式の証明書と、証明書の発行時に作成した秘密鍵のパスをそれぞれ指定します。

ちなみに、SSLでない方のポート(ここでは80)に来たリクエストをSSLのポート(443)にリダイレクトさせることもできます。

設定が終わったらtorとNginxを再起動します。

```bash
$ sudo systemctl restart tor
$ sudo systemctl restart nginx
```

しばらくしてから、Tor Browser等でサイトにアクセスしてみてください。

Tor BrowserではOnion ServiceのWebサイトにアクセスすると、必ず玉ねぎの鍵アイコンが出るので、そこから証明書の情報を確認してください。

情報が正しければ設定は完了です。おつかれさまでした。

## おまけ: Onion-Location

Onion ServiceのWebサイトが通常のWebのサイトのミラーである場合、Tor BrowserにOnion ServiceのWebサイトが利用可能であることを知らせることができます。

[Tor Project &#124; Onion-Location](https://community.torproject.org/onion-services/advanced/onion-location/)

アドレスバーの横に「.onion available」というボタンが表示されて簡単にOnion Service版のサイトにアクセスできるようになるので、設定しておいて損はないはずです。

なおOnion Serviceでない、HTTPSに対応しているサイトでのみ有効です。

`<head>`内に以下のようなタグを追加するだけです。

```html
<meta http-equiv="Onion-Location" content="https://examplexxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxd.onion/">
```

Onion-Locationヘッダーを送信することもできます。

例えばNginxで設定する場合は以下のようにします。
```conf
server {
    listen 443 ssl;
    server_name example.com;
    add_header Onion-Location "https://examplexxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxd.onion$request_uri";
}
```

