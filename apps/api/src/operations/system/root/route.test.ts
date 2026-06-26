import { describe, expect, it } from 'vitest'

import { createApp } from '../../../app.js'
import { rootResponseSample } from './samples.js'
import { RootResponseSchema } from './schemas.js'

describe('GET /', () => {
  it('正常系レスポンスを返す', async () => {
    const response = await createApp().request('/')
    expect(response.status).toBe(200)
    expect(RootResponseSchema.parse(await response.json())).toEqual({
      name: 'saphnexa-api',
      status: 'ok',
    })
  })

  it('サンプルがスキーマと整合する', () => {
    expect(RootResponseSchema.parse(rootResponseSample)).toEqual(rootResponseSample)
  })
})
