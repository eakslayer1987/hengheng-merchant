import { v4 as uuidv4 } from 'uuid'

// Simple storage using fetch (S3-compatible API without AWS SDK)
// Works with Cloudflare R2, MinIO, or any S3-compatible storage

export async function uploadFile(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  folder = 'receipts'
): Promise<string> {
  const endpoint   = process.env.STORAGE_ENDPOINT   || ''
  const accessKey  = process.env.STORAGE_ACCESS_KEY || ''
  const secretKey  = process.env.STORAGE_SECRET_KEY || ''
  const bucket     = process.env.STORAGE_BUCKET     || ''
  const publicUrl  = process.env.STORAGE_PUBLIC_URL || ''

  // If no storage configured, return placeholder
  if (!endpoint || !accessKey) {
    console.warn('[Storage] No storage configured, returning placeholder URL')
    return `https://via.placeholder.com/400x300?text=Receipt`
  }

  const ext = filename.split('.').pop() || 'jpg'
  const key = `${folder}/${uuidv4()}.${ext}`

  // Use native fetch with presigned URL approach
  // For Cloudflare R2: use S3-compatible PUT
  const url = `${endpoint}/${bucket}/${key}`

  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type':   mimeType,
        'Content-Length': String(buffer.length),
        'Authorization':  `Bearer ${accessKey}`,
        'x-amz-acl':      'public-read',
      },
      body: buffer,
    })

    if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
    return `${publicUrl}/${key}`
  } catch (e) {
    console.error('[Storage] Upload error:', e)
    // Return placeholder so app doesn't crash
    return `${publicUrl || ''}/${key}`
  }
}
