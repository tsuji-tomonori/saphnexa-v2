import { mkdir, readFile, writeFile } from 'node:fs/promises'

const schemaPath = new URL('../db/schema.sql', import.meta.url)
const metadataPath = new URL('../db/docs-metadata.json', import.meta.url)
const outputPath = new URL('../docs/database/schema.md', import.meta.url)

const ddl = await readFile(schemaPath, 'utf8')
const metadata = JSON.parse(await readFile(metadataPath, 'utf8'))

const tableBlocks = [...ddl.matchAll(/CREATE TABLE\s+rag\.(\w+)\s*\(([^;]+?)\n\);/gs)]
const indexBlocks = [
  ...ddl.matchAll(/CREATE INDEX ASYNC\s+(\w+)\s+ON\s+rag\.(\w+)\s*\(([^)]+)\);/g),
]

const tables = tableBlocks.map(([, name, body]) => {
  const lines = body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const columns = []
  const constraints = []
  for (const rawLine of lines) {
    const line = rawLine.replace(/,$/, '')
    if (line.startsWith('CONSTRAINT ')) {
      constraints.push(line)
      continue
    }
    const firstSpaceIndex = line.indexOf(' ')
    if (firstSpaceIndex < 1) continue
    const column = line.slice(0, firstSpaceIndex)
    const definition = line.slice(firstSpaceIndex + 1).trim()
    columns.push({ column, definition })
  }
  return { name, columns, constraints }
})

const tableNames = tables.map((table) => table.name)
const indexByTable = new Map(tableNames.map((name) => [name, []]))
for (const [, indexName, tableName, columns] of indexBlocks) {
  indexByTable.get(tableName)?.push({ indexName, columns: columns.replace(/\s+/g, ' ') })
}

const crudRows = Object.entries(metadata.crud).map(([actor, access]) => {
  const cells = tableNames.map((tableName) => access[tableName] ?? '')
  return [actor, ...cells]
})

const mermaidColumns = (table) =>
  table.columns
    .map(({ column, definition }) => {
      const upperDefinition = definition.toUpperCase()
      const markerPositions = [' NOT NULL', ' NULL', ' DEFAULT', ' CHECK', ' PRIMARY', ' UNIQUE']
        .map((markerText) => upperDefinition.indexOf(markerText))
        .filter((position) => position >= 0)
      const typeEnd = markerPositions.length > 0 ? Math.min(...markerPositions) : definition.length
      const type = definition.slice(0, typeEnd)
      const marker = table.constraints.some((constraint) =>
        constraint.includes(`PRIMARY KEY (${column})`),
      )
        ? ' PK'
        : ''
      return `    ${type.replaceAll(' ', '_')} ${column}${marker}`
    })
    .join('\n')

const erRelations = metadata.relations
  .map(({ from, to, label }) => `  ${from} ||--o{ ${to} : "${label}"`)
  .join('\n')

const doc = `# RAG データベース定義

このファイルは \`db/schema.sql\` と \`db/docs-metadata.json\` から自動生成されています。手動編集せず、\`npm run docs:db\` を実行してください。

## ER 図

Aurora DSQL では外部キーを使わず、アプリケーション層のトランザクションで参照整合性を検証します。下図のリレーションは論理関係です。

\`\`\`mermaid
erDiagram
${tables.map((table) => `  ${table.name} {\n${mermaidColumns(table)}\n  }`).join('\n')}
${erRelations}
\`\`\`

## CRUD 図

| API / 処理 | ${tableNames.join(' | ')} |
| --- | ${tableNames.map(() => '---').join(' | ')} |
${crudRows.map((row) => `| ${row.join(' | ')} |`).join('\n')}

凡例: C=Create、R=Read、U=Update、D=Delete。空欄は直接アクセスなし。

## テーブル定義

${tables
  .map(
    (table) => `### rag.${table.name}

| Column | Definition |
| --- | --- |
${table.columns.map(({ column, definition }) => `| \`${column}\` | \`${definition}\` |`).join('\n')}

#### Constraints

${table.constraints.map((constraint) => `- \`${constraint}\``).join('\n') || '- なし'}

#### Indexes

${(indexByTable.get(table.name) ?? []).map(({ indexName, columns }) => `- \`${indexName}\`: \`${columns}\``).join('\n') || '- なし'}
`,
  )
  .join('\n')}

## DDL

\`\`\`sql
${ddl.trim()}
\`\`\`
`

await mkdir(new URL('../docs/database/', import.meta.url), { recursive: true })
await writeFile(outputPath, doc)
console.log(`generated ${outputPath.pathname}`)
