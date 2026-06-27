import { OpenAPIHono } from '@hono/zod-openapi'

import { chatRoutes } from './operations/chat/post/route.js'
import { documentDeleteRoutes } from './operations/documents/delete/route.js'
import { documentListRoutes } from './operations/documents/list/route.js'
import { uploadUrlRoutes } from './operations/documents/upload-url/route.js'
import { healthRoutes } from './operations/system/health/route.js'
import { rootRoutes } from './operations/system/root/route.js'

export const routes = new OpenAPIHono()
  .route('/', rootRoutes)
  .route('/', healthRoutes)
  .route('/', chatRoutes)
  .route('/', uploadUrlRoutes)
  .route('/', documentListRoutes)
  .route('/', documentDeleteRoutes)
