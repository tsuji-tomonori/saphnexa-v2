export const openApiConfig = {
  openapi: '3.1.0',
  info: {
    title: 'saphnexa API',
    version: '0.1.0',
    description: 'saphnexa-v2 の API 契約',
    license: { name: 'UNLICENSED', identifier: 'UNLICENSED' },
  },
  'x-generated': '自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新',
  jsonSchemaDialect: 'https://json-schema.org/draft/2020-12/schema',
  security: [],
  servers: [{ url: 'https://api.saphnexa.local', description: 'Default API server' }],
}
