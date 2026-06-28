/* eslint-disable -- OpenAPI JSONを動的に走査する生成CLI */
import { generatedHeader } from './generation-io.js'
import { operationRegistry } from './registry.js'

type OperationRegistryEntry = (typeof operationRegistry)[number]

type FactorElement = {
  key: string
  name: string
  expected: string
  terminal?: boolean
}

type TestFactor = {
  factorId: string
  kind: string
  title: string
  source: string
  elements: FactorElement[]
}

type TestCase = Array<FactorElement | undefined>

const markdownEscape = (value: string) => value.replaceAll('|', '\\|').replaceAll('\n', ' ').trim()

const statusExpectation = (status: string, description: string) => {
  const normalized = description ? `: ${description}` : ''
  const kind = status.startsWith('2') ? 'success' : 'error'
  return `HTTP ${status} ${kind} response${normalized}`
}

const responseEntries = (operation: Record<string, any>) =>
  Object.entries(operation['responses'] ?? {}).sort(([a], [b]) => Number(a) - Number(b)) as Array<
    [string, Record<string, any>]
  >

const implicitRouterErrors = (operation: Record<string, any>) => {
  const errors: Array<{ process: string; condition: string; expected: string }> = []
  const hasRequestValidation = Boolean(operation['parameters']?.length || operation['requestBody'])
  const validationResponse = operation['responses']?.['400'] ?? operation['responses']?.['422']
  if (hasRequestValidation) {
    const status = operation['responses']?.['422'] ? '422' : '400'
    errors.push({
      process: 'Hono/Zod request validation',
      condition: 'Path/Query/Header/Body が型または制約に一致しない場合。',
      expected: statusExpectation(status, validationResponse?.description ?? '入力検証エラー'),
    })
  }
  return errors
}

const buildFactors = (operation: Record<string, any>) => {
  const validationStatuses = new Set(
    implicitRouterErrors(operation)
      .map((error) => error.expected.match(/^HTTP (\d+)/)?.[1])
      .filter(Boolean),
  )
  return responseEntries(operation)
    .filter(([status]) => !status.startsWith('2') && !validationStatuses.has(status))
    .map(([status, response], index): TestFactor => {
      const description = response['description'] ?? ''
      return {
        factorId: `F${String(index + 1).padStart(2, '0')}`,
        kind: 'エラー応答',
        title: `エラー応答: HTTP ${status}${description ? ` ${description}` : ''}`,
        source: `OpenAPI responses.${status}`,
        elements: [
          {
            key: 'raised',
            name: '発生',
            expected: statusExpectation(status, description),
            terminal: true,
          },
          {
            key: 'normal',
            name: '発生しない',
            expected: '当該エラー応答へ遷移せず、後続処理を継続する。',
          },
        ],
      }
    })
}

const productCases = (factors: TestFactor[]): TestCase[] => {
  if (factors.length === 0) return []
  const cases: TestCase[] = []
  const appendCases = (index: number, selected: TestCase) => {
    if (index >= factors.length) {
      cases.push(selected)
      return
    }
    for (const element of factors[index]?.elements ?? []) {
      const next = [...selected, element]
      if (element.terminal) {
        cases.push([...next, ...Array<undefined>(factors.length - index - 1).fill(undefined)])
        continue
      }
      appendCases(index + 1, next)
    }
  }
  appendCases(0, [])
  return cases
}

const renderImplicitRouterErrors = (operation: Record<string, any>) => {
  const errors = implicitRouterErrors(operation)
  if (errors.length === 0)
    return '## 0. Router層の暗黙処理\n\n_暗黙的な入力検証のケースはありません。_\n'
  const rows = errors.map(
    (error, index) =>
      `| \`R${String(index + 1).padStart(3, '0')}\` | ${markdownEscape(error.process)} | ${markdownEscape(error.condition)} | ${markdownEscape(error.expected)} |`,
  )
  return `## 0. Router層の暗黙処理\n\n| Case ID | 処理 | 発生条件 | 期待観点 |\n| --- | --- | --- | --- |\n${rows.join('\n')}\n`
}

const renderFactorElements = (factors: TestFactor[]) => {
  if (factors.length === 0) return '## 1. 要因ごとの要素\n\n_分岐対象のエラー応答はありません。_\n'
  return `## 1. 要因ごとの要素\n\n${factors
    .map((factor) => {
      const rows = factor.elements.map(
        (element) =>
          `| \`${factor.factorId}-${element.key}\` | ${markdownEscape(element.name)} | ${markdownEscape(element.expected)} |`,
      )
      return `### ${factor.factorId} ${factor.kind}\n\n- 対象: ${factor.title}\n- Source: \`${markdownEscape(factor.source)}\`\n\n| 要素ID | 要素 | 期待観点 |\n| --- | --- | --- |\n${rows.join('\n')}\n`
    })
    .join('\n')}`
}

const renderProductCases = (factors: TestFactor[]) => {
  const cases = productCases(factors)
  if (cases.length === 0)
    return '## 2. 直積したテストケース一覧\n\n_直積対象の要因はありません。_\n'
  const header = `| Case ID | ${factors.map((factor) => factor.factorId).join(' | ')} |`
  const separator = `| --- | ${factors.map(() => '---').join(' | ')} |`
  const rows = cases.map(
    (testCase, index) =>
      `| \`TC${String(index + 1).padStart(3, '0')}\` | ${testCase.map((element) => (element ? `\`${markdownEscape(element.name)}\`` : '-')).join(' | ')} |`,
  )
  return `## 2. 直積したテストケース一覧\n\n${header}\n${separator}\n${rows.join('\n')}\n`
}

const renderTestDetails = (factors: TestFactor[], successStatus: string) => {
  const cases = productCases(factors)
  if (cases.length === 0)
    return `## 3. テスト詳細\n\n| 要因 | 要素 | 期待観点 |\n| --- | --- | --- |\n| API正常応答 | 正常 | HTTP ${successStatus} success response |\n`
  return `## 3. テスト詳細\n\n${cases
    .map((testCase, index) => {
      const rows = testCase.flatMap((element, factorIndex) => {
        const factor = factors[factorIndex]
        if (!element || !factor) return []
        return `| \`${factor.factorId}\` ${markdownEscape(factor.title)} | ${markdownEscape(element.name)} | ${markdownEscape(element.expected)} |`
      })
      if (!testCase.some((element) => element?.terminal)) {
        rows.push(`| API正常応答 | 正常 | HTTP ${successStatus} success response |`)
      }
      return `### TC${String(index + 1).padStart(3, '0')}\n\n| 要因 | 要素 | 期待観点 |\n| --- | --- | --- |\n${rows.join('\n')}\n`
    })
    .join('\n')}`
}

const successStatus = (operation: Record<string, any>) =>
  responseEntries(operation).find(([status]) => status.startsWith('2'))?.[0] ?? '200'

const renderUnitTestFactors = (entry: OperationRegistryEntry, operation: Record<string, any>) => {
  const factors = buildFactors(operation)
  const title = operation['summary'] ?? entry.contract.operationId
  return `${generatedHeader}# ${title} unit test factors\n\n- Operation: \`${entry.contract.operationId}\`\n- Endpoint: \`${entry.method.toUpperCase()} ${entry.path}\`\n- Source: OpenAPI document and operation registry\n\n${renderImplicitRouterErrors(operation)}\n${renderFactorElements(factors)}\n${renderProductCases(factors)}\n${renderTestDetails(factors, successStatus(operation))}`
}

export const generateUnitTestFactors = (document: Record<string, any>) =>
  operationRegistry.map((entry) => {
    const operation = document['paths']?.[entry.path]?.[entry.method] ?? {}
    return {
      path: `../../docs/spec/40.apis/${entry.contract.markdownSlug}/unit-test_gen.md`,
      content: renderUnitTestFactors(entry, operation),
    }
  })
