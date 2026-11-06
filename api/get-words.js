import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: "Falta configurar DATABASE_URL en Vercel" });
    }
    const sql = neon(process.env.DATABASE_URL);
    const words = await sql`SELECT * FROM vocabulario ORDER BY id ASC`;
    return res.status(200).json(words);
  } catch (error) {
    console.error("GET error:", error);
    return res.status(500).json({ error: error.message });
  }
}