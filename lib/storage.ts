import { v4 as uuidv4 } from 'uuid'

export async function uploadFile(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  folder = 'receipts'
): Promise<string> {
  const endpoint  = process.env.STORAGE_ENDPOINT   || ''
  const accessKey = process.env.STORAGE_ACCESS_KEY || ''
  const bucket    = process.env.STORAGE_BUCKET     || ''
  const publicUrl = process.env.STORAGE_PUBLIC_URL || ''

  const ext = filename.split('.').pop() || 'jpg'
  const key = `${folder}/${uuidv4()}.${ext}`

  if (!endpoint || !accessKey) {
    console.warn('[Storage] No storage configured')
    return `/uploads/${key}`
  }

  try {
    const url = `${endpoint}/${bucket}/${key}`
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': mimeType,
        'Authorization': `Bearer ${accessKey}`,
      },
      body: buffer,
    })
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
    return `${publicUrl}/${key}`
  } catch (e) {
    console.error('[Storage] Upload error:', e)
    return `${publicUrl}/${key}`
  }
}
