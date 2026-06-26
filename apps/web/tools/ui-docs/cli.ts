import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { format } from 'prettier'

import type { ScreenContract } from '../../shared/screen-contract'

const webRoot = resolve(new URL('../..', import.meta.url).pathname)
const repoRoot = resolve(webRoot, '../..')
const docsRoot = resolve(repoRoot, 'docs/spec/45.screens')

async function main() {
  const command = process.argv[2] ?? 'generate'
  const check = process.argv.includes('--check')

  if (command === 'lint') {
    await lintScreenContracts()
    return
  }

  if (command !== 'generate') {
    throw new Error(`Unknown command: ${command}`)
  }

  await generateScreenDocs({ check })
}

async function generateScreenDocs({ check }: { check: boolean }) {
  const contracts = await loadScreenContracts()
  const outputs = new Map<string, string>()

  outputs.set(
    join(docsRoot, 'screens-list.gen.md'),
    await formatMarkdown(generateScreenList(contracts)),
  )

  for (const contract of contracts) {
    outputs.set(
      join(docsRoot, screenSlug(contract), 'screen-spec.gen.md'),
      await formatMarkdown(generateScreenSpec(contract)),
    )
  }

  for (const [filePath, content] of outputs) {
    if (check) {
      const current = existsSync(filePath) ? await readFile(filePath, 'utf8') : ''
      if (current !== content) {
        throw new Error(`Generated docs are out of date: ${relative(repoRoot, filePath)}`)
      }
      continue
    }

    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(filePath, content)
  }
}

async function lintScreenContracts() {
  const contracts = await loadScreenContracts()
  const seenScreenIds = new Set<string>()
  const seenRouteNames = new Set<string>()
  const seenRoutePaths = new Set<string>()

  for (const contract of contracts) {
    assertUnique(seenScreenIds, contract.id, 'screen ID')
    assertUnique(seenRouteNames, contract.route.name, 'route name')
    assertUnique(seenRoutePaths, contract.route.path, 'route path')

    const pagePath = findPageForRoute(contract.route.path)
    if (!pagePath) {
      throw new Error(`No Nuxt page found for ${contract.id} (${contract.route.path})`)
    }

    const pageSource = await readFile(pagePath, 'utf8')
    for (const expected of [
      'screen.contract',
      'definePageMeta',
      '.route.name',
      '.route.path',
      '.layout',
      '.id',
      '.access.mode',
      '.access.permissions',
    ]) {
      if (!pageSource.includes(expected)) {
        throw new Error(
          `${relative(repoRoot, pagePath)} does not reference screen contract metadata: ${expected}`,
        )
      }
    }
  }
}

async function loadScreenContracts(): Promise<ScreenContract[]> {
  const files = await findFiles(join(webRoot, 'features'), 'screen.contract.ts')
  const contracts: ScreenContract[] = []

  for (const file of files) {
    const module = (await import(`${pathToFileURL(file).href}?updated=${Date.now()}`)) as Record<
      string,
      unknown
    >
    for (const value of Object.values(module)) {
      if (isScreenContract(value)) {
        contracts.push(value)
      }
    }
  }

  return contracts.sort((left, right) => left.id.localeCompare(right.id))
}

async function findFiles(root: string, filename: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const entryPath = join(root, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await findFiles(entryPath, filename)))
    } else if (entry.name === filename) {
      files.push(entryPath)
    }
  }

  return files
}

function isScreenContract(value: unknown): value is ScreenContract {
  return Boolean(
    value &&
    typeof value === 'object' &&
    typeof (value as ScreenContract).id === 'string' &&
    (value as ScreenContract).id.startsWith('SCR-') &&
    typeof (value as Partial<ScreenContract>).route === 'object' &&
    typeof (value as ScreenContract).route.path === 'string',
  )
}

function generateScreenList(contracts: readonly ScreenContract[]): string {
  const rows = contracts
    .map((contract) => {
      const auth = contract.access.mode === 'public' ? '不要' : '必要'
      const permissions =
        contract.access.permissions.length > 0 ? contract.access.permissions.join(', ') : 'なし'
      return `| ${contract.id} | ${contract.title} | ${contract.route.path} | ${auth} | ${permissions} | ${contract.layout} | 実装済み |`
    })
    .join('\n')

  return `# 画面一覧\n\n> このファイルは \`npm run ui-docs:generate --workspace @saphnexa/web\` で自動生成します。\n\n| 画面ID | 画面名 | URL | 認証 | 権限 | レイアウト | 実装状態 |\n|---|---|---|---|---|---|---|\n${rows}\n`
}

function generateScreenSpec(contract: ScreenContract): string {
  const permissions =
    contract.access.permissions.length > 0 ? contract.access.permissions.join(', ') : 'なし'
  const states = contract.states
    .map(
      (state) =>
        `| ${state.id} | ${state.summary} | ${state.story ?? '未設定'} | ${state.visualTest ? '対象' : '任意'} |`,
    )
    .join('\n')
  const apis =
    contract.apiDependencies.length > 0
      ? contract.apiDependencies
          .map((api) => `| ${api.trigger} | ${api.operationId} | ${api.resultStates.join(', ')} |`)
          .join('\n')
      : '| なし | なし | なし |'
  const actions =
    contract.actions.length > 0
      ? contract.actions
          .map(
            (action) =>
              `| ${action.id} | ${action.label} | ${action.kind} | ${action.operationId ?? 'なし'} | ${action.toScreenId ?? 'なし'} |`,
          )
          .join('\n')
      : '| なし | なし | なし | なし | なし |'

  return `# ${contract.title} 画面仕様\n\n> このファイルは \`npm run ui-docs:generate --workspace @saphnexa/web\` で自動生成します。\n\n## 基本情報\n\n| 項目 | 値 |\n|---|---|\n| 画面ID | ${contract.id} |\n| 画面名 | ${contract.title} |\n| 目的 | ${contract.summary} |\n| URL | ${contract.route.path} |\n| route name | ${contract.route.name} |\n| 認証 | ${contract.access.mode} |\n| 権限 | ${permissions} |\n| レイアウト | ${contract.layout} |\n\n## 利用API\n\n| 契機 | API operationId | 成功・失敗時状態 |\n|---|---|---|\n${apis}\n\n## 表示状態\n\n| 状態 | 発生条件・概要 | Story | visual test |\n|---|---|---|---|\n${states}\n\n## 操作\n\n| 操作ID | UI要素 | 種別 | API | 遷移先 |\n|---|---|---|---|---|\n${actions}\n`
}

async function formatMarkdown(content: string): Promise<string> {
  return format(content, { parser: 'markdown' })
}

function screenSlug(contract: ScreenContract): string {
  return contract.id.toLowerCase().replace(/^scr-/, '').replaceAll('-', '/')
}

function assertUnique(values: Set<string>, value: string, label: string) {
  if (values.has(value)) {
    throw new Error(`Duplicated ${label}: ${value}`)
  }
  values.add(value)
}

function findPageForRoute(routePath: string): string | undefined {
  if (routePath === '/') {
    const indexPage = join(webRoot, 'pages/index.vue')
    return existsSync(indexPage) ? indexPage : undefined
  }

  const pagePath = join(webRoot, 'pages', routePath, 'index.vue')
  return existsSync(pagePath) ? pagePath : undefined
}

await main()
