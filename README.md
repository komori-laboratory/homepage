# KomoriLab Homepage (Astro)

株式会社小森研究所サイトの Astro 実装プロジェクトです。

## セットアップ

```bash
npm install
npm run dev
```

## 品質チェック

```bash
npm run check
npm run check:links
npm run qa
```

## 主なURL

- `/` トップ
- `/profile/` 会社情報
- `/contactus/` お問い合わせ
- `/privacy/` プライバシーポリシー
- `/activities/` 活動一覧
- `/:year/:month/:day/:slug/` 活動詳細

## リダイレクト

- `/company/` -> `/profile/`
- `/contact/` -> `/contactus/`
- `/privacy-policy/` -> `/privacy/`
- `/news/` -> `/activities/`

## ディレクトリ

- `src/layouts`: 共通レイアウト
- `src/components`: UI部品
- `src/pages`: ルーティングページ
- `src/data`: サイト表示用データ
- `src/lib`: 表示ヘルパー
