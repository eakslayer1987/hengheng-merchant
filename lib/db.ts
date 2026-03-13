/**
 * DB Client - calls PHP proxy on Hostneverdie
 * เพราะ Vercel (AWS) ต่อ MySQL Hostneverdie direct ไม่ได้
 */

const PROXY_URL    = 'https://xn--72cac8e8ec.com/shop/api/db-proxy.php'
const PROXY_SECRET = 'hh-proxy-2025-xnca-secret'

async function proxyRequest(action: string, sql: string, params: any[] = []) {
  const res = await fetch(PROXY_URL, {
    method:  'POST',
    headers: {
      'Content-Type':    'application/json',
      'X-Proxy-Secret':  PROXY_SECRET,
    },
    body: JSON.stringify({ action, sql, params }),
  })

  if (!res.ok) throw new Error(`Proxy HTTP ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(`DB Error: ${data.error}`)
  return data
}

// SELECT — returns array of rows
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const data = await proxyRequest('query', sql, params)
  return data.rows as T[]
}

// SELECT one row
export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows[0] ?? null
}

// INSERT / UPDATE / DELETE
export async function execute(sql: string, params: any[] = []): Promise<{ insertId: number; affectedRows: number }> {
  const data = await proxyRequest('execute', sql, params)
  return { insertId: Number(data.insertId), affectedRows: Number(data.affectedRows) }
}
