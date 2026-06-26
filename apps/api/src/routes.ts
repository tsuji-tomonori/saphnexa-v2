import { OpenAPIHono } from '@hono/zod-openapi'

import { healthRoutes } from './operations/system/health/route.js'
import { rootRoutes } from './operations/system/root/route.js'

export const routes = new OpenAPIHono().route('/', rootRoutes).route('/', healthRoutes)
