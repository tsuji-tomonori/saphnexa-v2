# saphnexa-v2

Nuxt 4、Nuxt UI v4、Hono、AWS CDK、TypeScript を npm workspaces で管理する開発環境です。

## 必要環境

- Node.js 20.19 以上
- npm 11 以上

## セットアップ

```bash
npm install
```

## 開発コマンド

```bash
npm run dev:web      # Nuxt: http://localhost:3000
npm run dev:api      # Hono: http://localhost:8787（開発時は /docs でSwagger UI）
npm run build        # 全 workspace のビルド
npm run typecheck    # 全 workspace の型チェック
npm run test         # 全 workspace の Vitest テスト
npm run test:coverage # 全 workspace の Vitest カバレッジ
npm run lint         # ESLint + SonarJS ルール
npm run format:check # Prettier チェック
npm run stylelint    # Vue/CSS の Stylelint
npm run deadcode     # Knip による不要コード・依存確認
npm run deps:check   # dependency-cruiser による循環依存・レイヤー確認
npm run semgrep      # RAG 固有の Semgrep CE ルール
npm run cdk -- synth
npm run docs:generate --workspace @saphnexa/api # OpenAPI/IF仕様を生成
npm run docs:check --workspace @saphnexa/api    # 生成物の差分を検出
npm run openapi:lint --workspace @saphnexa/api  # OpenAPI品質検査
```

## ディレクトリ構成

```text
apps/web  Nuxt 4 + Nuxt UI v4 アプリ
apps/api  Hono API（OpenAPIHono + Zod を一次情報にしたAPI契約）
openapi   生成済みOpenAPI 3.1 JSON
docs/spec/40.apis  生成済みAPI一覧・IF仕様
docs/design        UI デザイン仕様（Relay DS）
infra     AWS CDK スタック
```

## Web UI

MVP の Web UI は Cognito Managed Login を前提に自作認証画面を持たず、`/` は `/chat` へリダイレクトします。主要画面は、回答ストリーミングと引用元 Slideover を備える `/chat`、Presigned URL アップロード・取込状態一覧・削除確認モーダルを備える `/documents` です。UI 基盤は `@nuxt/ui`、Markdown 表示基盤は `@comark/nuxt`、アイコンは Lucide Iconify コレクションを使用します。デザイントークン・コンポーネントの仕様は `docs/design/design-system.md`（Relay DS）を単一の真実とします。

## 静的解析・品質ゲート

SonarQube サーバーには依存せず、ローカルと CI で実行できる OSS ツールを組み合わせます。

| 対象                   | ツール                                                                              | コマンド                |
| ---------------------- | ----------------------------------------------------------------------------------- | ----------------------- |
| Nuxt UI/Vue/TypeScript | ESLint、typescript-eslint、eslint-plugin-sonarjs、eslint-plugin-vuejs-accessibility | `npm run lint`          |
| 単体テスト             | Vitest、@nuxt/test-utils、@vue/test-utils、happy-dom、aws-cdk-lib/assertions        | `npm run test`          |
| カバレッジ             | @vitest/coverage-v8                                                                 | `npm run test:coverage` |
| フォーマット           | Prettier                                                                            | `npm run format:check`  |
| CSS / Vue `<style>`    | Stylelint                                                                           | `npm run stylelint`     |
| 不要コード・不要依存   | Knip                                                                                | `npm run deadcode`      |
| 循環依存・レイヤー違反 | dependency-cruiser                                                                  | `npm run deps:check`    |
| RAG 固有 SAST          | Semgrep CE                                                                          | `npm run semgrep`       |
| CDK セキュリティ       | cdk-nag v3                                                                          | `npm run cdk -- synth`  |

CI では、`npm install` 後に `format:check`、`lint`、`typecheck`、`test`、`build`、`deadcode`、`deps:check`、`semgrep`、`npm run cdk -- synth` を順に実行する想定です。Trivy、Betterleaks、cfn-lint は実行環境のバイナリとして追加し、リポジトリ外のインストール手順で管理します。

## API契約とIF仕様

`apps/api/src/app.ts` の `createApp()` はHTTPサーバーを起動せず、テストや文書生成からimportできます。サーバー起動は `apps/api/src/server.ts` に限定しています。公開APIは operation 単位で `contract.ts`、`schemas.ts`、`samples.ts`、`route.ts` を持ち、Zod schema / `createRoute` / operation contract を一次情報として OpenAPI 3.1 と Markdown IF仕様を生成します。

生成物は `openapi/openapi.gen.json`、`docs/spec/40.apis/apis-list.gen.md`、`docs/spec/40.apis/**/if.gen.md` です。変更後は `npm run docs:generate --workspace @saphnexa/api` を実行し、CI相当では `npm run docs:check --workspace @saphnexa/api` と `npm run archlint --workspace @saphnexa/api` で生成漏れと契約不整合を検出します。

## テスト方針

テストは npm workspaces 共通で Vitest に統一しています。API は Hono の `app.request()` で HTTP サーバーを起動せずに route を検証し、Web は `@nuxt/test-utils` の Vitest 設定と `@vue/test-utils` / `happy-dom` で Vue component を検証します。Infra は Vitest と `aws-cdk-lib/assertions` で CDK Stack の synth 結果を検証します。

```bash
npm run test                 # apps/* と infra のテストを実行
npm run test:coverage        # apps/* と infra のカバレッジを生成
npm run test --workspace @saphnexa/api
npm run test --workspace @saphnexa/web
npm run test --workspace @saphnexa/infra
```
