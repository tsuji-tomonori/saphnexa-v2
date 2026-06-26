import { createApp } from '../../src/app.js'
import { openApiConfig } from '../../src/shared/http/openapi.js'
import { stable } from './generation-io.js'

export const generateOpenApi = () =>
  `${JSON.stringify(stable(createApp().getOpenAPI31Document(openApiConfig)), null, 2)}\n`
