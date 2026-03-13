import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host:            process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT   || '3306'),
  database:        process.env.DB_NAME     || 'meeprung_reward',
  user:            process.env.DB_USER     || 'root',
  password:        process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+07:00',
})

export async function query<T = unknown>(sql: string, values?: unknown[]): Promise<T[]> {
  const [rows] = await pool.execute(sql, values)
  return rows as T[]
}

export async function queryOne<T = unknown>(sql: string, values?: unknown[]): Promise<T | null> {
  const rows = await query<T>(sql, values)
  return rows[0] ?? null
}

export async function execute(sql: string, values?: unknown[]): Promise<mysql.ResultSetHeader> {
  const [result] = await pool.execute(sql, values)
  return result as mysql.ResultSetHeader
}

export default pool
