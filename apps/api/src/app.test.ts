import { describe, expect, it } from 'vitest'

import { createApp } from './app.js'

describe('createApp', () => {
  it('OpenAPI JSON を返す', async () => {
    const response = await createApp().request('/openapi.json')

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      openapi: '3.1.0',
      info: { title: 'saphnexa API' },
    })
  })
})
