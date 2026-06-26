<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->

# root sequence

```mermaid
sequenceDiagram
  autonumber
  participant User as User
  participant API as API
  User->>API: GET /
  API->>API: API名と簡易ステータスを取得する。
  API-->>User: HTTP 200 OK
```
