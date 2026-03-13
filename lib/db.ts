import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host:              process.env.DB_HOST     || 'localhost',
  port:              parseInt(process.env.DB_PORT || '3306'),
  database:          process.env.DB_NAME     || 'meeprung_reward',
  user:              process.env.DB_USER     || 'root',
  password:          process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit:   10,
  queueLimit:        0,
})

export async function query<T = any>(sql: string, values?: any[]): Promise<T[]> {
  const [rows] = await pool.execute<any>(sql, values)
  return rows as T[]
}

export async function queryOne<T = any>(sql: string, values?: any[]): Promise<T | null> {
  const rows = await query<T>(sql, values)
  return rows[0] ?? null
}

export async function execute(sql: string, values?: any[]): Promise<{ insertId: number; affectedRows: number }> {
  const [result] = await pool.execute<any>(sql, values)
  return { insertId: result.insertId, affectedRows: result.affectedRows }
}

export default pool
