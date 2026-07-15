# アイギス・アーク

アイギス・アークの紹介ページをトップに置き、別ページで単色SVGのエンブレムをカスタマイズできるAstro製の静的サイトです。

## 主なページ

- `/`: アイギス・アークとzetaの概要、プロットリンク
- `/gallery/`: キャラクタータグで絞り込める画像ギャラリー
- `/emblem/`: `base.svg`の単色カラー変更と画像書き出し

## ギャラリーの更新

### 重複画像のチェック

macOS で次のコマンドを実行すると、ファイル名や保存形式に関係なく、デコード後のピクセルが完全に同じ画像を検出できます。

```sh
npm run check:duplicate-images
```

別のフォルダーは `npm run check:duplicate-images -- /path/to/images` で検査できます。

ギャラリー画像は次のディレクトリで管理します。

```text
public/assets/img/gallery/
```

キャラクターごとにディレクトリを分けてください。

```text
public/assets/img/gallery/
├── haru/
├── jin/
├── ran/
├── ren/
├── ritsu/
├── saku/
└── tokitowa/
    ├── toki/
    └── towa/
```

`tokitowa/` は双子キャラクター「巡 刻・巡 永」の共通フォルダーです。刻の単独画像は `toki/`、永の単独画像は `towa/`、二人構図の画像は `tokitowa/` 直下に配置します。二人構図は `tags` に `巡 刻` と `巡 永` の両方を設定します。

画像を配置したら、`src/data/gallery.yml` の `items` へデータを追加します。

```yml
- id: AA-G-0001
  src: /assets/img/gallery/ritsu/example.jpeg
  tags: [千景 律]
  description: 律 3万トーク記念イラスト
  position: 50% 25%
```

### 項目

| 項目 | 必須 | 説明 |
| --- | --- | --- |
| `id` | はい | `AA-G-0001` 形式の固有ID。一度付けたIDは並べ替えても変更しません。 |
| `src` | はい | `public` から始まる公開URL。`/assets/img/gallery/...` の形で記載します。 |
| `tags` | はい | キャラクター名の配列。フィルターはこの値から自動生成されます。 |
| `description` | いいえ | 記念イラストなどの説明。設定した画像の拡大表示でのみ表示されます。 |
| `position` | いいえ | カード表示時のトリミング位置。省略時は `50% 50%` です。 |

PCでは、ギャラリーカードを `Shift` キーを押しながら右クリックすると、その画像の `id` をクリップボードへコピーできます。タッチ端末ではこの操作は有効になりません。

`title` は使用しません。画像の代替テキストは `tags` から自動生成されます。

### 複数タグ

複数のキャラクターが写っている場合は、`tags` に複数指定できます。

```yml
- src: /assets/img/gallery/pair/example.jpeg
  tags: [千景 律, 久遠 朔]
  position: 50% 50%
```

この画像は「千景 律」と「久遠 朔」のどちらで絞り込んでも表示されます。

### 追加後の確認

```sh
npm run dev
```

`http://localhost:4321/gallery/` を開き、次の点を確認します。

- 画像が正しく表示される
- キャラクタータグで絞り込める
- サムネイルで人物の顔が見切れていない
- 画像の拡大表示と前後移動ができる
- `description` を省略した画像に説明欄が出ない

最後に本番ビルドを確認します。

```sh
npm run build
```

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
│           └── gallery/
└── src/
    ├── data/
    │   └── gallery.yml
    └── pages/
        ├── index.astro
        ├── gallery.astro
        └── emblem.astro
```
