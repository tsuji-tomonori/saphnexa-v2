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
npm run dev:web   # Nuxt: http://localhost:3000
npm run dev:api   # Hono: http://localhost:8787
npm run build     # 全 workspace のビルド
npm run typecheck # 全 workspace の型チェック
npm run cdk -- synth
```

## ディレクトリ構成

```text
apps/web  Nuxt アプリ
apps/api  Hono API
infra     AWS CDK スタック
```
