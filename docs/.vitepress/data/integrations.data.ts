// Build-time data loader for the integration / MCP catalog.
// The data itself lives in the plain-TS module ./integrations.ts (so client
// components can import it directly); this loader just exposes it to markdown
// pages via `import { data } from '../.vitepress/data/integrations.data.ts'`.
import { integrationCategories, type IntegrationsData } from './integrations'

export type { Integration, IntegrationCategory, IntegrationsData } from './integrations'

export default {
  load(): IntegrationsData {
    return { categories: integrationCategories }
  },
}
