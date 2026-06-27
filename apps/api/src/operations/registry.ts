import type { OperationRegistryEntry } from './types.js'
import { contract as chatContract } from './chat/contract.js'
import { chatEventSample } from './chat/samples.js'
import { deleteDocumentContract, listDocumentsContract, uploadUrlContract } from './documents/contract.js'
import { createUploadUrlResponseSample, documentListResponseSample } from './documents/samples.js'
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
  {
    contract: chatContract,
    method: 'post',
    path: '/api/chat',
    tag: 'chat',
    successSample: chatEventSample,
  },
  {
    contract: uploadUrlContract,
    method: 'post',
    path: '/api/documents/upload-url',
    tag: 'documents',
    successSample: createUploadUrlResponseSample,
  },
  {
    contract: listDocumentsContract,
    method: 'get',
    path: '/api/documents',
    tag: 'documents',
    successSample: documentListResponseSample,
  },
  {
    contract: deleteDocumentContract,
    method: 'delete',
    path: '/api/documents/{documentId}',
    tag: 'documents',
    successSample: null,
  },
] as const satisfies readonly OperationRegistryEntry[]
