import { HealthResponseSchema } from './schemas.js'

export const healthResponseSample = HealthResponseSchema.parse({ status: 'healthy' })
