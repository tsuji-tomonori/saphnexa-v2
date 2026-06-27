import { OpenAPIHono } from '@hono/zod-openapi'

import { chatRoutes } from './operations/chat/post/route.js'
import { documentRoutes } from './operations/documents/routes.js'
import { healthRoutes } from './operations/system/health/route.js'
import { rootRoutes } from './operations/system/root/route.js'

export const routes = new OpenAPIHono()
  .route('/', rootRoutes)
  .route('/', healthRoutes)
  .route('/api/chat', chatRoutes)
  .route('/api/documents', documentRoutes)
