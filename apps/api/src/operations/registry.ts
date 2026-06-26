import type { OperationRegistryEntry } from './types.js'
import { contract as healthContract } from './system/health/contract.js'
import { healthResponseSample } from './system/health/samples.js'
import { contract as rootContract } from './system/root/contract.js'
import { rootResponseSample } from './system/root/samples.js'

export const operationRegistry = [
  {
    contract: rootContract,
    method: 'get',
    path: '/',
    tag: 'system',
    successSample: rootResponseSample,
  },
  {
    contract: healthContract,
    method: 'get',
    path: '/health',
    tag: 'system',
    successSample: healthResponseSample,
  },
] as const satisfies readonly OperationRegistryEntry[]
