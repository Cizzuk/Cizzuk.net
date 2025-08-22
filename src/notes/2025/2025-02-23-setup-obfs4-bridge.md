---
layout: "post"
lang: "ja"
permalink: "/notes/setup-obfs4-bridge/"
description: "obfs4ブリッジのセットアップ方法を書きました。"
title: "自分専用のプライベートobfs4ブリッジを建てよう"
---

そういえば日本語の情報が全然ないような気がするので書こうと思います。

日本語非対応ですが一応公式のドキュメントはあります。(プライベート用途向けではない？)

[Tor Project \| Bridge](https://community.torproject.org/relay/setup/bridge/)

## はじめに

以下の条件のサーバーで建てます。

- Tor Projectのリポジトリが入っている
- torをインストール済み
- ポート解放が可能
- 素でTorネットワークに接続可能
- OSはDebian/Ubuntu

他のOSでも大きくは変わらないと思います。Tor Projectのリポジトリとtorのインストールに関しては以下を参照してください。

[Why and how I can enable Tor Package Repository in Debian? \| Tor Project \| Support](https://support.torproject.org/apt/tor-deb-repo/)

また、あなたの条件は以下の通りです。

- CUI操作に理解が十分にある
- サーバーに関する知識がある
- Torに対する知識が十分にある

## obfs4proxyを準備

まずはobfs4proxyをインストールします。

```bash
$ sudo apt install obfs4proxy
```

次にtorrcを編集します。

```bash
$ sudo vi /etc/tor/torrc
```

torrcに以下の設定を追加します

```
BridgeRelay 1
ORPort 9001
PublishServerDescriptor 0
BridgeDistribution none
ServerTransportPlugin obfs4 exec /usr/bin/obfs4proxy
ServerTransportListenAddr obfs4 0.0.0.0:443
ExtORPort auto
Nickname ExampleRelay
ContactInfo example@example.com
```

- `ORPort`のポートを開く必要はありません。
- `BridgeDistribution`と`PublishServerDescriptor`はこのobfs4ブリッジを非公開にするように設定にしてあります。
  - ブリッジを公式のTelegramやメール等で公開することもできますが、中国などの検閲の強い地域からブロックされる可能性があるので、個人のブリッジの場合は非公開にすることを推奨します。
- `ServerTransportListenAddr`にはクライアントがobfs4に接続するときのポートを設定します。
  - このポートは開いておいてください。
  - クライアントがポート検閲/監視のあるネットワークから接続する場合は、それを考慮してください。
  - `ORPort`と同じポートにはしないでください。
- `Nickname`と`ContactInfo`はオプションなので、消しても問題ありません。

次に以下のコマンドでobfs4が特権ポートにバインドすることを許可します。

```bash
$ sudo setcap cap_net_bind_service=+ep /usr/bin/obfs4proxy
```

systemdサービスの設定ファイル2つを編集します。

```bash
$ sudo systemctl edit tor@.service tor@default.service
```

エディタが開かれるのでそれぞれ以下を書き込んで保存します。

```conf
[Service]
NoNewPrivileges=no
```

最後にtorを再起動します。

```bash
$ sudo systemctl restart tor.service
```

これでobfs4ブリッジが動作しているはずです。

## ブリッジラインを取得してブリッジに接続する

まずは以下のコマンドでテンプレートを取得します。

```bash
$ sudo cat /var/lib/tor/pt_state/obfs4_bridgeline.txt
```

すると以下のようなテンプレートが出力されます。

```
Bridge obfs4 <IP ADDRESS>:<PORT> <FINGERPRINT> cert=XxXxXxXxXxXxXxXx iat-mode=0
```

- `<IP ADDRESS>`には、グローバルIPアドレスを入れます。ipv4でもipv6でもどちらでも良いです。
- `<PORT>`には、torrcの`ServerTransportListenAddr`で設定したポートを入れます。
- `<FINGERPRINT>`に入れる内容は以下のコマンドで入手します。
  ```bash
  $ sudo cat /var/lib/tor/fingerprint
  ```

完成したブリッジラインはTor BrowserやTailsに入力して使用できます。Tor Browserではアドレスバーの左から、TailsではOnion Circuitsを開いて、自分のobfs4ブリッジを経由していることを確認できます。

ブリッジを使用してTorネットワークに接続できたら完了です。お疲れ様でした。
