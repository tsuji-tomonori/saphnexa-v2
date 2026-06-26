import { generatedHeader } from './generation-io.js'
import { operationRegistry } from './registry.js'
import type { ApiSequenceStep } from '../../src/operations/types.js'

const statusText: Record<number, string> = {
  200: 'OK',
  201: 'Created',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Content',
  500: 'Internal Server Error',
}

const responseLine = (status: number) =>
  `API-->>User: HTTP ${status} ${statusText[status] ?? ''}`.trim()

const renderStep = (step: ApiSequenceStep) => {
  if (step.type === 'call') return `API->>API: ${step.summary}`
  const response = responseLine(step.status)
  if (step.detail) {
    return [`alt ${step.condition}`, response, `Note over User,API: ${step.detail}`, 'end'].join(
      '\n',
    )
  }
  return [`alt ${step.condition}`, response, 'end'].join('\n')
}

export const generateSequenceSpecs = () =>
  operationRegistry.map((entry) => {
    const title = `${entry.contract.markdownSlug.split('/').at(-1) ?? entry.contract.operationId} sequence`
    const requestLine = `User->>API: ${entry.method.toUpperCase()} ${entry.path}`
    const steps = entry.contract.sequence.map(renderStep).join('\n')
    const content = `${generatedHeader}# ${title}

\`\`\`mermaid
sequenceDiagram
  autonumber
  participant User as User
  participant API as API
  ${requestLine}
${steps
  .split('\n')
  .map((line) => `  ${line}`)
  .join('\n')}
  ${responseLine(entry.contract.successStatus)}
\`\`\`
`
    return {
      path: `../../docs/spec/40.apis/${entry.contract.markdownSlug}/sequence.gen.md`,
      content,
    }
  })
