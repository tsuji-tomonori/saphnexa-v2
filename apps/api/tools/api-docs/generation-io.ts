import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

export const generatedHeader =
  '<!-- 自動生成・直接編集禁止: npm run docs:generate --workspace @saphnexa/api で更新 -->\n\n'

export const writeOrCheck = async (path: string, content: string, check: boolean) => {
  const next = content.endsWith('\n') ? content : `${content}\n`
  if (check) {
    const current = await readFile(path, 'utf8').catch(() => '')
    if (current !== next) {
      console.error(`生成物が最新ではありません: ${path}`)
      process.exitCode = 1
    }
    return
  }
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, next)
}

export const stable = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stable)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(
    Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => [k, stable(v)]),
  )
}
