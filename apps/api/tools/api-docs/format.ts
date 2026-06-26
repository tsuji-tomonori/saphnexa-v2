import { format, resolveConfig } from 'prettier'

const parserFor = (path: string) => {
  if (path.endsWith('.json')) return 'json'
  if (path.endsWith('.md')) return 'markdown'
  return undefined
}

export const formatGenerated = async (path: string, content: string) => {
  const parser = parserFor(path)
  const config = (await resolveConfig(path)) ?? {}
  return parser ? await format(content, { printWidth: 100, ...config, parser }) : content
}
