import { z } from '@hono/zod-openapi'

export const ChatRequestSchema = z.object({
  message: z.string().min(1).max(4000).openapi({ description: '質問本文' }),
}).openapi('ChatRequest')

export const CitationSchema = z.object({
  id: z.string().openapi({ description: '引用ID' }),
  documentId: z.string().openapi({ description: '文書ID' }),
  title: z.string().openapi({ description: '文書名' }),
  excerpt: z.string().openapi({ description: '引用テキスト' }),
  page: z.number().int().positive().optional().openapi({ description: 'ページ番号' }),
}).openapi('Citation')

export const ChatEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('delta'), text: z.string() }),
  z.object({ type: z.literal('citation'), citation: CitationSchema }),
  z.object({ type: z.literal('done'), messageId: z.string() }),
  z.object({ type: z.literal('error'), code: z.string(), message: z.string() }),
]).openapi('ChatEvent')
