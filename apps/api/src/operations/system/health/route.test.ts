import { describe, expect, it } from 'vitest'

import { createApp } from '../../../app.js'
import { ErrorResponseSchema } from '../../../shared/http/errors.js'
import { healthResponseSample } from './samples.js'
import { HealthResponseSchema } from './schemas.js'

describe('GET /health', () => {
  it('正常系レスポンスを返す', async () => {
    const response = await createApp().request('/health')
    expect(response.status).toBe(200)
    expect(HealthResponseSchema.parse(await response.json())).toEqual({ status: 'healthy' })
  })

  it('入力検証エラーを共通ErrorResponseで返す', async () => {
    const response = await createApp().request('/health?fail=invalid')
    expect(response.status).toBe(400)
    expect(ErrorResponseSchema.parse(await response.json()).error.code).toBe('VALIDATION_ERROR')
  })

  it('宣言した業務エラーステータスを返す', async () => {
    const response = await createApp().request('/health?fail=conflict')
    expect(response.status).toBe(409)
    expect(ErrorResponseSchema.parse(await response.json()).error.code).toBe(
      'HEALTH_CHECK_CONFLICT',
    )
  })

  it('想定外例外を500に変換する', async () => {
    const response = await createApp().request('/health?throw=unexpected')
    expect(response.status).toBe(500)
    expect(ErrorResponseSchema.parse(await response.json()).error.code).toBe(
      'INTERNAL_SERVER_ERROR',
    )
  })

  it('サンプルがスキーマと整合する', () => {
    expect(HealthResponseSchema.parse(healthResponseSample)).toEqual(healthResponseSample)
  })
})
