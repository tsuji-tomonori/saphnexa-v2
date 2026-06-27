import { ApiError } from '../../../shared/http/errors.js'
import { ChatEventSchema } from '../schemas.js'
import type { z } from 'zod'

type ChatEvent = z.infer<typeof ChatEventSchema>

export async function* createChatEvents(message: string): AsyncGenerator<ChatEvent> {
  const endpoint = process.env['RAG_CHAT_ENDPOINT']
  if (!endpoint) {
    yield { type: 'error', code: 'RAG_CONFIGURATION_ERROR', message: 'RAG回答生成設定が不足しています' }
    return
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message }),
  })
  if (!response.ok || response.body === null) {
    throw new ApiError(500, 'RAG_UPSTREAM_ERROR', 'RAG回答生成に失敗しました')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    const nextBuffer = lines.pop()
    if (nextBuffer === undefined) throw new ApiError(500, 'RAG_STREAM_PARSE_ERROR', 'RAGストリームを解析できません')
    buffer = nextBuffer
    for (const line of lines) {
      if (!line.trim()) continue
      yield ChatEventSchema.parse(JSON.parse(line))
    }
  }
  if (buffer.trim()) yield ChatEventSchema.parse(JSON.parse(buffer))
}
