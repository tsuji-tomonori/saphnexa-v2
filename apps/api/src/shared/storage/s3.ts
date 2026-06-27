import { PutObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { ApiError } from '../http/errors.js'

const s3 = new S3Client({ region: process.env['AWS_REGION'] ?? process.env['AWS_DEFAULT_REGION'] ?? 'us-east-1' })

const getBucketName = () => {
  const bucketName = process.env['DOCUMENT_BUCKET_NAME']
  if (!bucketName) throw new ApiError(500, 'STORAGE_CONFIGURATION_ERROR', 'S3バケット設定が不足しています')
  return bucketName
}

export const createUploadUrl = async ({ key, contentType, fileSize }: { key: string; contentType: string; fileSize: number }) => {
  const expiresIn = 900
  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: getBucketName(), Key: key, ContentType: contentType, ContentLength: fileSize }),
    { expiresIn },
  )
  return { uploadUrl, expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString() }
}

export const deleteDocumentObject = async (key: string) => {
  if (process.env['S3_DELETE_DISABLED'] === 'true' && process.env['NODE_ENV'] !== 'production') return
  await s3.send(new DeleteObjectCommand({ Bucket: getBucketName(), Key: key }))
}
