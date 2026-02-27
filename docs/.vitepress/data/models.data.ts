// VitePress build-time data loader for model documentation.
// Reads data/models.yaml and makes it available to markdown pages at build time.
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

export interface Model {
  id: string
  context: string
  price: string
  status: 'available' | 'beta' | 'deprecated'
  tags: string[]
}

export interface Vendor {
  name: string
  tagline?: string
  models: Model[]
}

export interface ModelsData {
  vendors: Vendor[]
}

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Minimal line-by-line parser for the known models.yaml schema.
 * Handles the exact indentation structure without an external dependency.
 *
 * Schema levels (spaces):
 *   0  vendors:
 *   2    - name: ...
 *   4      tagline: ...
 *   4      models:
 *   6        - id: ...
 *   8          context / price / status / tags: ...
 */
function parseModelsYaml(yaml: string): ModelsData {
  const vendors: Vendor[] = []
  let currentVendor: Vendor | null = null
  let currentModel: Model | null = null
  let inVendors = false
  let inModels = false

  for (const line of yaml.split('\n')) {
    const trimmed = line.trimStart()
    if (trimmed === '' || trimmed.startsWith('#')) continue

    const indent = line.length - trimmed.length

    if (trimmed === 'vendors:') {
      inVendors = true
      continue
    }
    if (!inVendors) continue

    // New vendor entry
    if (indent === 2 && trimmed.startsWith('- name:')) {
      if (currentModel && currentVendor) currentVendor.models.push(currentModel)
      currentModel = null
      if (currentVendor) vendors.push(currentVendor)
      currentVendor = { name: trimmed.replace('- name:', '').trim(), models: [] }
      inModels = false
      continue
    }

    if (!currentVendor) continue

    if (indent === 4 && trimmed.startsWith('tagline:')) {
      currentVendor.tagline = trimmed
        .replace('tagline:', '')
        .trim()
        .replace(/^["']|["']$/g, '')
      continue
    }

    if (indent === 4 && trimmed === 'models:') {
      inModels = true
      continue
    }

    if (!inModels) continue

    // New model entry
    if (indent === 6 && trimmed.startsWith('- id:')) {
      if (currentModel) currentVendor.models.push(currentModel)
      currentModel = {
        id: trimmed.replace('- id:', '').trim(),
        context: '',
        price: '',
        status: 'available',
        tags: [],
      }
      continue
    }

    if (!currentModel) continue

    if (indent === 8) {
      const kv = trimmed.match(/^(\w+):\s*(.*)$/)
      if (!kv) continue
      const [, key, rawVal] = kv
      const val = rawVal.trim().replace(/^["']|["']$/g, '')

      switch (key) {
        case 'context':
          currentModel.context = val
          break
        case 'price':
          currentModel.price = val
          break
        case 'status':
          currentModel.status = val as Model['status']
          break
        case 'tags': {
          // Inline array syntax: [tag1, tag2, tag3]
          currentModel.tags = val
            .replace(/^\[|\]$/g, '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
          break
        }
      }
    }
  }

  // Flush last in-flight objects.
  if (currentModel && currentVendor) currentVendor.models.push(currentModel)
  if (currentVendor) vendors.push(currentVendor)

  return { vendors }
}

export default {
  load(): ModelsData {
    const yamlPath = resolve(__dirname, '../../../data/models.yaml')
    const text = readFileSync(yamlPath, 'utf8')
    return parseModelsYaml(text)
  },
}
