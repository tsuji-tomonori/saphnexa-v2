import { afterEach, describe, expect, it } from 'vitest'

import { createApp } from '../../../app.js'

describe('POST /api/chat', () => {
  afterEach(() => {
    delete process.env['AUTH_DISABLED']
    delete process.env['RAG_CHAT_ENDPOINT']
  })

  it('Bearerトークンなしは401を返す', async () => {
    const response = await createApp().request('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: '質問' }),
    })
    expect(response.status).toBe(401)
  })

  it('RAG未設定時はSSEのerrorイベントを返す', async () => {
    process.env['AUTH_DISABLED'] = 'true'
    const response = await createApp().request('/api/chat', {
      method: 'POST',
      headers: { authorization: 'Bearer test', 'content-type': 'application/json' },
      body: JSON.stringify({ message: '質問' }),
    })
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/event-stream')
    expect(await response.text()).toContain('RAG_CONFIGURATION_ERROR')
  })
})
