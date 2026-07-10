# アイギス・アーク

アイギス・アークの紹介ページをトップに置き、別ページで単色SVGのエンブレムをカスタマイズできるAstro製の静的サイトです。

## 主なページ

- `/`: アイギス・アークとzetaの概要、プロットリンク
- `/emblem/`: `base.svg`の単色カラー変更と画像書き出し

## 技術構成

- Astro
- Cloudflare Pages
- ブラウザ完結の静的HTML/CSS/JavaScript
- ビルド成果物: `dist/`

## 推奨環境

- Node.js: `>=24 <25`
- npm: Node.js 24系に同梱されるnpm 11系

## ローカル確認

ローカルのNode.jsとnpmのバージョンを確認します。

```sh
node -v
npm -v
```

依存関係をインストールします。

```sh
npm install
```

開発サーバーを起動します。

```sh
npm run dev
```

ブラウザで開く:

```text
http://localhost:4321/
```

本番ビルド:

```sh
npm run build
```

ビルド結果の確認:

```sh
npm run preview
```

## Cloudflare Pages設定

| 項目 | 設定値 |
| --- | --- |
| Project name | `aegis-arc` |
| Production branch | `main` |
| Framework preset | `Astro` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | 未設定 |

## デプロイ

Cloudflare Pagesは、`main`ブランチへのpushをきっかけにデプロイされます。

push前に本番ビルドを確認します。

```sh
npm run build
```

変更をコミットして`main`へpushします。

```sh
git status
git add .
git commit -m "Update site"
git push origin main
```

## ファイル構成

```text
.
├── astro.config.mjs
├── package.json
├── package-lock.json
├── public/
│   ├── base.svg
│   ├── manifest.webmanifest
│   └── assets/
│       └── img/
└── src/
    └── pages/
        ├── index.astro
        └── emblem.astro
```
