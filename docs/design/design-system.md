# Relay DS — デザイン仕様

社内ナレッジ検索 RAG アプリ（Saphnexa）の UI デザインシステム。
クリーン/ミニマル、ニュートラル基調 + インディゴのアクセントを基本トーンとする。

このドキュメントは UI デザインの**単一の真実 (source of truth)** であり、
`apps/web` の実装はここで定義したトークン・パターンに従う。

デザイン原本（移管元）も同じディレクトリに保管する。

- `RAG Design System (standalone).html` — デザインカタログ（ブラウザで開いて確認）
- `RAGアプリケーションのUI設計.zip` — React 参照実装（`relay-ui/` のトークン・コンポーネント）

これらは閲覧用の原本であり、整形・lint の対象外（`.prettierignore` 参照）。

## トークン

トークンは Tailwind v4 の `@theme` として `apps/web/assets/css/main.css` に、
カラーエイリアスは Nuxt UI 設定として `apps/web/app.config.ts` に実装する。

### カラー

ニュートラル（`ink` / Nuxt UI の `neutral`）:

| シェード | HEX       | シェード | HEX       |
| -------- | --------- | -------- | --------- |
| 50       | `#fafbfc` | 500      | `#8b8e98` |
| 100      | `#f4f5f7` | 600      | `#62656e` |
| 200      | `#e9eaee` | 700      | `#44464d` |
| 300      | `#d8dadf` | 800      | `#2a2c31` |
| 400      | `#b4b7bf` | 900      | `#16171a` |

アクセント（`iris` / Nuxt UI の `primary`）:

| 役割    | HEX       |
| ------- | --------- |
| soft/50 | `#eeeefb` |
| 200     | `#c7c7f5` |
| 400     | `#8f8fea` |
| 500     | `#5b5bd6` |
| 600     | `#4646b8` |

セマンティック:

| 種別    | fg        | bg        | dot       |
| ------- | --------- | --------- | --------- |
| success | `#1f7d4d` | `#e9f6ee` | `#2f9e64` |
| warning | `#9a6a13` | `#fbf3e3` | `#c98a1a` |
| danger  | `#b23e2e` | `#fdece8` | `#d4503e` |

ハイライト（検索ヒット）: `#fff3cf`

### フォント

| 用途 | フォントスタック                               |
| ---- | ---------------------------------------------- |
| sans | `'Zen Kaku Gothic New', system-ui, sans-serif` |
| mono | `'JetBrains Mono', ui-monospace, monospace`    |

Google Fonts は `apps/web/nuxt.config.ts` の `app.head` で読み込む
（`Zen Kaku Gothic New` 400/500/700、`JetBrains Mono` 400/500/600）。
メタ情報・数値・コード・ステータスは mono、本文は sans を使う。

### スペーシング / 角丸 / 影

4px ベーススケール: `2xs=4 / xs=8 / sm=12 / md=16 / lg=24 / xl=32 / 2xl=48`（px）。

角丸: `sm=6 / md=8 / lg=10 / xl=14 / pill=999`（px）。
既定コントロールは `md`（`--ui-radius: 0.5rem`）、カードは `xl` を基準にする。

影: `sm`（カード境界の補助）、`md`（浮きカード）、`lg`（モーダル・ポップオーバー）。

### ファイル種別バッジ配色（fileTypeStyle）

| 種別 | bg        | fg        | 対象拡張子            | クラス   |
| ---- | --------- | --------- | --------------------- | -------- |
| PDF  | `#fdece8` | `#b23e2e` | `.pdf`                | `ft-pdf` |
| DOC  | `#e9f1fb` | `#2d6fb8` | `.doc` `.docx`        | `ft-doc` |
| XLS  | `#e9f6ee` | `#1f7d4d` | `.xls` `.xlsx` `.csv` | `ft-xls` |
| TXT  | `#f4f5f7` | `#8b8e98` | その他・拡張子なし    | `ft-txt` |

## コンポーネント仕様

実装は `apps/web/components/rag/` に置き、トークンを参照する。

### ファイル種別バッジ — `FileTypeBadge.vue`

- ファイル名の拡張子から種別（PDF / DOC / XLS / TXT）を判定する。
- 種別ラベル（大文字）を mono で表示し、`ft-*` クラスで配色する。
- 未知・拡張子なしは TXT にフォールバックする。
- `size` で正方形の寸法を指定する。

### ステータスバッジ — `DocStatusBadge.vue`

ドット付きの pill バッジで取込状態を日本語表示する。進行中の状態はドットを点滅させる。

| status       | ラベル         | 点滅 |
| ------------ | -------------- | ---- |
| `ready`      | 処理済         | なし |
| `processing` | 処理中         | あり |
| `uploading`  | アップロード中 | あり |
| `failed`     | エラー         | なし |
| `deleting`   | 削除中         | あり |

### 引用ソースカード — `CitationList.vue`

RAG の根拠提示の中核。引用元 1 件を以下の要素で構成したカードで提示する。

- 連番バッジ（`index + 1`、インディゴ塗り）
- ファイル種別バッジ + 出典名
- 抜粋（鉤括弧「」で囲み、左罫線付きのクオート表示）
- ページ等のメタ情報（存在する場合のみ）
- 「原典を開く →」導線。クリックで `preview` イベントを発火する。

引用元が 0 件のときは何も描画しない。

### 引用元プレビュー — `SourcePreview.vue`

Slideover で引用元の詳細を表示する。ファイル種別バッジ・出典名・文書ID/ページ、
および左罫線付きクオートで抜粋を提示する。

### その他

- `AppShell.vue` — 角丸の濃色ロゴマーク + サービス名のブランドヘッダ。
- `DocumentTable.vue` — ファイル種別バッジ + ステータスバッジ + mono 日時の一覧。

## 検証

UI コンポーネントの表示規則は単体テスト（`apps/web/components/rag/*.test.ts`）で
本仕様に対する整合を検証する。
