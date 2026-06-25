# saphnexa-v2

Nuxt 3、Hono、AWS CDK、TypeScript を npm workspaces で管理する開発環境です。

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
npm run dev:api      # Hono: http://localhost:8787
npm run build        # 全 workspace のビルド
npm run typecheck    # 全 workspace の型チェック
npm run lint         # ESLint + SonarJS ルール
npm run format:check # Prettier チェック
npm run stylelint    # Vue/CSS の Stylelint
npm run deadcode     # Knip による不要コード・依存確認
npm run deps:check   # dependency-cruiser による循環依存・レイヤー確認
npm run semgrep      # RAG 固有の Semgrep CE ルール
npm run cdk -- synth
```

## ディレクトリ構成

```text
apps/web  Nuxt アプリ
apps/api  Hono API
infra     AWS CDK スタック
```

## 静的解析・品質ゲート

SonarQube サーバーには依存せず、ローカルと CI で実行できる OSS ツールを組み合わせます。

| 対象                   | ツール                                                                              | コマンド               |
| ---------------------- | ----------------------------------------------------------------------------------- | ---------------------- |
| Nuxt/Vue/TypeScript    | ESLint、typescript-eslint、eslint-plugin-sonarjs、eslint-plugin-vuejs-accessibility | `npm run lint`         |
| フォーマット           | Prettier                                                                            | `npm run format:check` |
| CSS / Vue `<style>`    | Stylelint                                                                           | `npm run stylelint`    |
| 不要コード・不要依存   | Knip                                                                                | `npm run deadcode`     |
| 循環依存・レイヤー違反 | dependency-cruiser                                                                  | `npm run deps:check`   |
| RAG 固有 SAST          | Semgrep CE                                                                          | `npm run semgrep`      |
| CDK セキュリティ       | cdk-nag v3                                                                          | `npm run cdk -- synth` |

CI では、`npm install` 後に `format:check`、`lint`、`typecheck`、`build`、`deadcode`、`deps:check`、`semgrep`、`npm run cdk -- synth` を順に実行する想定です。Trivy、Betterleaks、cfn-lint は実行環境のバイナリとして追加し、リポジトリ外のインストール手順で管理します。
