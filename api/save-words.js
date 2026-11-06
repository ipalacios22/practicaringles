import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const { words, tipo } = req.body;
  const sql = neon(process.env.DATABASE_URL);

  // Limpiamos y guardamos la nueva lista del tipo especificado
  await sql`DELETE FROM vocabulario WHERE tipo = ${tipo}`;
  
  for (const item of words) {
    await sql`
      INSERT INTO vocabulario (ingles, espanol, pasado, participio, tipo)
      VALUES (${item.en}, ${item.es}, ${item.past || null}, ${item.participle || null}, ${tipo})
    `;
  }

  return res.status(200).json({ success: true });
}