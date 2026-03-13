import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.STORAGE_ENDPOINT || '',
  credentials: {
    accessKeyId:     process.env.STORAGE_ACCESS_KEY || '',
    secretAccessKey: process.env.STORAGE_SECRET_KEY || '',
  },
})

export async function uploadFile(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  folder = 'receipts'
): Promise<string> {
  const ext  = filename.split('.').pop() || 'jpg'
  const key  = `${folder}/${uuidv4()}.${ext}`

  await s3.send(new PutObjectCommand({
    Bucket:      process.env.STORAGE_BUCKET || '',
    Key:         key,
    Body:        buffer,
    ContentType: mimeType,
    ACL:         'public-read',
  }))

  return `${process.env.STORAGE_PUBLIC_URL}/${key}`
}
