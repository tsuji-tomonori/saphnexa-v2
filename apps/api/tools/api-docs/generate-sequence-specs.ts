import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import ts from 'typescript'

import { generatedHeader } from './generation-io.js'
import { operationRegistry } from './registry.js'

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

type ParsedError = {
  condition: string
  status: number
  detail?: string
}

type ParsedCall = {
  name: string
  errors: ParsedError[]
}

type ParsedSequence = {
  successStatus: number
  calls: ParsedCall[]
  routeErrors: ParsedError[]
}

const apiRoot = resolve('src/operations')

const parsedError = (condition: string, status: number, detail?: string): ParsedError => ({
  condition,
  status,
  ...(detail ? { detail } : {}),
})

const responseLine = (status: number) =>
  `API-->>User: HTTP ${status} ${statusText[status] ?? ''}`.trim()

const sourceFile = (path: string) =>
  ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true)

const stringLiteral = (node: ts.Node | undefined) =>
  node && ts.isStringLiteralLike(node) ? node.text : undefined

const numberLiteral = (node: ts.Node | undefined) => {
  if (!node) return undefined
  if (ts.isNumericLiteral(node)) return Number(node.text)
  return undefined
}

const propertyNameText = (name: ts.PropertyName) => {
  if (ts.isIdentifier(name) || ts.isStringLiteralLike(name) || ts.isNumericLiteral(name))
    return name.text
  return undefined
}

const routeSourcePath = (markdownSlug: string) => join(apiRoot, markdownSlug, 'route.ts')

const importedModules = (file: ts.SourceFile) => {
  const imports = new Map<string, string>()
  for (const statement of file.statements) {
    if (!ts.isImportDeclaration(statement)) continue
    const moduleName = stringLiteral(statement.moduleSpecifier)
    const bindings = statement.importClause?.namedBindings
    if (!moduleName || !bindings || !ts.isNamedImports(bindings)) continue
    for (const element of bindings.elements) {
      imports.set(element.name.text, moduleName)
    }
  }
  return imports
}

const resolveImportedSource = (fromPath: string, moduleName: string) => {
  if (!moduleName.startsWith('.')) return undefined
  const sourceModule = moduleName.endsWith('.js') ? moduleName.slice(0, -3) : moduleName
  return resolve(dirname(fromPath), `${sourceModule}.ts`)
}

const routeResponses = (file: ts.SourceFile) => {
  const responses = new Map<number, string>()

  const visit = (node: ts.Node) => {
    if (ts.isPropertyAssignment(node) && propertyNameText(node.name) === 'responses') {
      const value = node.initializer
      if (ts.isObjectLiteralExpression(value)) {
        for (const property of value.properties) {
          if (!ts.isPropertyAssignment(property)) continue
          const status = Number(propertyNameText(property.name))
          if (!Number.isFinite(status)) continue
          const initializer = property.initializer
          if (ts.isCallExpression(initializer)) {
            responses.set(status, stringLiteral(initializer.arguments[0]) ?? '')
            continue
          }
          if (ts.isObjectLiteralExpression(initializer)) {
            const description = initializer.properties.find(
              (nested): nested is ts.PropertyAssignment =>
                ts.isPropertyAssignment(nested) && propertyNameText(nested.name) === 'description',
            )
            responses.set(status, stringLiteral(description?.initializer) ?? '')
          }
        }
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(file)
  return responses
}

const apiErrorFromThrow = (
  statement: ts.ThrowStatement,
  functionName: string,
): ParsedError | undefined => {
  const expression = statement.expression
  if (!expression || !ts.isNewExpression(expression)) return undefined
  const thrownName = ts.isIdentifier(expression.expression) ? expression.expression.text : undefined
  if (thrownName === 'ApiError') {
    const status = numberLiteral(expression.arguments?.[0])
    if (!status) return undefined
    return parsedError(
      `${functionName} が ApiError(${status}) を送出した場合。`,
      status,
      stringLiteral(expression.arguments?.[2]) ?? stringLiteral(expression.arguments?.[1]),
    )
  }
  if (thrownName === 'Error') {
    return parsedError(
      `${functionName} が想定外例外を送出した場合。`,
      500,
      stringLiteral(expression.arguments?.[0]),
    )
  }
  return undefined
}

const findFunctionBody = (file: ts.SourceFile, functionName: string) => {
  for (const statement of file.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name?.text === functionName)
      return statement.body
    if (!ts.isVariableStatement(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== functionName) continue
      const initializer = declaration.initializer
      if (!initializer) continue
      if (ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer))
        return initializer.body
    }
  }
  return undefined
}

const parseFunction = (functionPath: string, functionName: string): ParsedCall => {
  const file = sourceFile(functionPath)
  const body = findFunctionBody(file, functionName)
  const errors: ParsedError[] = []

  if (body) {
    const visit = (node: ts.Node) => {
      if (ts.isThrowStatement(node)) {
        const error = apiErrorFromThrow(node, functionName)
        if (error) errors.push(error)
      }
      ts.forEachChild(node, visit)
    }
    visit(body)
  }

  return { name: functionName, errors }
}

const routeHandlerFacts = (routePath: string, file: ts.SourceFile) => {
  const imports = importedModules(file)
  const calls: ParsedCall[] = []
  const routeErrors: ParsedError[] = []

  const addCall = (call: ts.CallExpression) => {
    if (!ts.isIdentifier(call.expression)) return
    const functionName = call.expression.text
    const moduleName = imports.get(functionName)
    const functionPath = moduleName ? resolveImportedSource(routePath, moduleName) : undefined
    if (!functionPath || calls.some((existing) => existing.name === functionName)) return
    calls.push(parseFunction(functionPath, functionName))
  }

  const visitHandler = (node: ts.Node) => {
    if (ts.isCallExpression(node)) addCall(node)
    if (ts.isThrowStatement(node)) {
      const error = apiErrorFromThrow(node, 'route handler')
      if (error) routeErrors.push(error)
    }
    ts.forEachChild(node, visitHandler)
  }

  const visitFile = (node: ts.Node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === 'openapi'
    ) {
      const handler = node.arguments[1]
      if (handler) visitHandler(handler)
      return
    }
    ts.forEachChild(node, visitFile)
  }

  visitFile(file)
  return { calls, routeErrors }
}

const parseRouteSequence = (markdownSlug: string): ParsedSequence => {
  const routePath = routeSourcePath(markdownSlug)
  const file = sourceFile(routePath)
  const responses = routeResponses(file)
  const successStatus = [...responses.keys()].find((status) => status >= 200 && status < 300) ?? 200
  const { calls, routeErrors } = routeHandlerFacts(routePath, file)
  const parsedStatuses = new Set([
    successStatus,
    ...routeErrors.map((error) => error.status),
    ...calls.flatMap((call) => call.errors.map((error) => error.status)),
  ])
  const responseOnlyErrors = [...responses.entries()]
    .filter(([status]) => status >= 400 && !parsedStatuses.has(status))
    .map(([status, detail]) => ({
      condition: `${detail || `HTTP ${status}`} の場合。`,
      status,
      detail,
    }))

  return { successStatus, calls, routeErrors: [...responseOnlyErrors, ...routeErrors] }
}

const renderError = (error: ParsedError) => {
  const response = responseLine(error.status)
  if (error.detail) {
    return [`alt ${error.condition}`, response, `Note over User,API: ${error.detail}`, 'end'].join(
      '\n',
    )
  }
  return [`alt ${error.condition}`, response, 'end'].join('\n')
}

const renderSequenceBody = (sequence: ParsedSequence) => [
  ...sequence.routeErrors.map(renderError),
  ...sequence.calls.flatMap((call) => [
    `API->>API: ${call.name} を実行する`,
    ...call.errors.map(renderError),
  ]),
]

export const generateSequenceSpecs = () =>
  operationRegistry.map((entry) => {
    const sequence = parseRouteSequence(entry.contract.markdownSlug)
    const title = `${entry.contract.markdownSlug.split('/').at(-1) ?? entry.contract.operationId} sequence`
    const requestLine = `User->>API: ${entry.method.toUpperCase()} ${entry.path}`
    const steps = renderSequenceBody(sequence).join('\n')
    const content = `${generatedHeader}# ${title}

\`\`\`mermaid
sequenceDiagram
  autonumber
  participant User as User
  participant API as API
  ${requestLine}
${steps
  .split('\n')
  .filter(Boolean)
  .map((line) => `  ${line}`)
  .join('\n')}
  ${responseLine(sequence.successStatus)}
\`\`\`
`
    return {
      path: `../../docs/spec/40.apis/${entry.contract.markdownSlug}/sequence.gen.md`,
      content,
    }
  })
