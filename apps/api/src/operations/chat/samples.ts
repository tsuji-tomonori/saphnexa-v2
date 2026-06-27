import { ChatEventSchema } from './schemas.js'

export const chatEventSample = ChatEventSchema.parse({ type: 'done', messageId: 'sample-message-id' })
