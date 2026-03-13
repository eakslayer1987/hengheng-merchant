const PROXY_URL    = 'https://xn--72cac8e8ec.com/shop/api/db-proxy.php'
const PROXY_SECRET = 'hh-proxy-2025-xnca-secret'

async function proxyRequest(action: string, sql: string, params: any[] = []) {
  const res  = await fetch(PROXY_URL, {
    method:  'POST',
    headers: {
      'Content-Type':   'application/json',
      'X-Proxy-Secret': PROXY_SECRET,
    },
    body: JSON.stringify({ action, sql, params }),
  })

  // Always read body regardless of status
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  if (!res.ok)    throw new Error(`Proxy HTTP ${res.status}`)
  return data
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const data = await proxyRequest('query', sql, params)
  return data.rows as T[]
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows[0] ?? null
}

export async function execute(sql: string, params: any[] = []): Promise<{ insertId: number; affectedRows: number }> {
  const data = await proxyRequest('execute', sql, params)
  return { insertId: Number(data.insertId), affectedRows: Number(data.affectedRows) }
}
