import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);
  const words = await sql`SELECT * FROM vocabulario ORDER BY id ASC`;
  return res.status(200).json(words);
}