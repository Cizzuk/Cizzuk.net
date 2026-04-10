# Cizzuk.net

私のWebサイトのソースコードです。Eleventyでビルドをして、Cloudflare Workersにデプロイします。

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

`./_site/`にページがビルドされます。

ビルド時にはHTML, CSS, JavaScript, XMLをMinifyして、キャッシュ可能なアセットのファイル名をユニークなものに変更します。

## Deploy

```bash
npx wrangler deploy
```

## Test

### Eleventy

```bash
npm run serve
```

### Wrangler

```bash
npx wrangler dev
```

## License

Copyright (c) 2020 Cizzuk All Rights Reserved.
