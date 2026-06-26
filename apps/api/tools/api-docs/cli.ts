/* eslint-disable -- OpenAPI JSONを動的に走査する生成CLI */
import { generateApiList } from './generate-api-list.js'
import { generateDetailDesignSpecs } from './generate-detail-design-specs.js'
import { generateIfSpecs } from './generate-if-specs.js'
import { generateOpenApi } from './generate-openapi.js'
import { formatGenerated } from './format.js'
import { stable, writeOrCheck } from './generation-io.js'
import { checkContracts } from './check-contracts.js'

const command = process.argv[2] ?? 'generate'
const check = process.argv.includes('--check')
const openApi = JSON.parse(generateOpenApi())

if (command === 'lint') {
  const errors = checkContracts(openApi)
  if (errors.length > 0) {
    console.error(errors.join('\n'))
    process.exit(1)
  }
  process.exit(0)
}

if (command !== 'generate') {
  console.error(`Unknown command: ${command}`)
  process.exit(1)
}

await writeOrCheck(
  '../../openapi/openapi.gen.json',
  await formatGenerated(
    '../../openapi/openapi.gen.json',
    `${JSON.stringify(stable(openApi), null, 2)}\n`,
  ),
  check,
)
await writeOrCheck(
  '../../docs/spec/40.apis/apis-list.gen.md',
  await formatGenerated('../../docs/spec/40.apis/apis-list.gen.md', generateApiList(openApi)),
  check,
)
for (const spec of generateIfSpecs(openApi)) {
  await writeOrCheck(spec.path, await formatGenerated(spec.path, spec.content), check)
}
for (const spec of generateDetailDesignSpecs(openApi)) {
  await writeOrCheck(spec.path, await formatGenerated(spec.path, spec.content), check)
}
