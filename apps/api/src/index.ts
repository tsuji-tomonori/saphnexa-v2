import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors())

app.get('/', (c) => c.json({ name: 'saphnexa-api', status: 'ok' }))
app.get('/health', (c) => c.json({ status: 'healthy' }))

const port = Number(process.env['PORT'] ?? 8787)

serve({ fetch: app.fetch, port }, (info) => {
  console.warn(`Hono API listening on http://localhost:${info.port}`)
})

export default app
