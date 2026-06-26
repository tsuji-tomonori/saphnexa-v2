import { RootResponseSchema } from './schemas.js'

export const rootResponseSample = RootResponseSchema.parse({ name: 'saphnexa-api', status: 'ok' })
