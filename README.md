# Cizzuk.net

私のWebサイトのソースコードです。Eleventyでビルドをして、Cloudflare Workersにデプロイします。

## Install

```bash
npm install
```

## Build

以下で`./_site/`にページがビルドされます。

```bash
npm run build
```

ビルド時にはHTML, CSS, JavaScript, XMLのMinifyして、キャッシュ可能なアセットのファイル名をユニークなものに変更します。

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
