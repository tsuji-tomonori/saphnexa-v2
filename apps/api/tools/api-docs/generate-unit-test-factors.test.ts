import { describe, expect, it } from 'vitest'

import { generateOpenApi } from './generate-openapi.js'
import { generateUnitTestFactors } from './generate-unit-test-factors.js'

describe('generateUnitTestFactors', () => {
  it('OpenAPIとoperationRegistryからunit-test_gen.mdを生成する', () => {
    const document = JSON.parse(generateOpenApi()) as Record<string, unknown>
    const specs = generateUnitTestFactors(document)
    const health = specs.find((spec) => spec.path.endsWith('/system/health/unit-test_gen.md'))

    expect(health?.content).toContain('# 稼働状態を取得する unit test factors')
    expect(health?.content).toContain('- Operation: `getHealth`')
    expect(health?.content).toContain('## 0. Router層の暗黙処理')
    expect(health?.content).toContain('Hono/Zod request validation')
    expect(health?.content).toContain('## 1. 要因ごとの要素')
    expect(health?.content).toContain('OpenAPI responses.409')
    expect(health?.content).toContain('## 2. 直積したテストケース一覧')
    expect(health?.content).toContain('## 3. テスト詳細')
    expect(health?.content).toContain('HTTP 200 success response')
  })
})
