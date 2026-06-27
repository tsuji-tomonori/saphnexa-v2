import { OpenAPIHono } from '@hono/zod-openapi'

import type { AuthEnv } from '../../shared/auth/types.js'
import { documentDeleteRoutes } from './delete/route.js'
import { documentListRoutes } from './list/route.js'
import { uploadUrlRoutes } from './upload-url/route.js'

export const documentRoutes = new OpenAPIHono<AuthEnv>()
  .route('/', documentListRoutes)
  .route('/', uploadUrlRoutes)
  .route('/', documentDeleteRoutes)
