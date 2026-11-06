import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: "Falta configurar DATABASE_URL en Vercel" });
    }

    const { words, tipo } = req.body;
    const targetTipo = tipo || 'active';
    const sql = neon(process.env.DATABASE_URL);

    // Limpiamos los registros anteriores de ese tipo
    await sql`DELETE FROM vocabulario WHERE tipo = ${targetTipo}`;

    if (words && Array.isArray(words) && words.length > 0) {
      for (const item of words) {
        const en = item.en || item.ingles || '';
        const es = item.es || item.espanol || '';
        const past = item.past || item.pasado || null;
        const participle = item.participle || item.participio || null;

        if (en.trim() !== '' && es.trim() !== '') {
          await sql`
            INSERT INTO vocabulario (ingles, espanol, pasado, participio, tipo)
            VALUES (${en}, ${es}, ${past}, ${participle}, ${targetTipo})
          `;
        }
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("SAVE error:", error);
    return res.status(500).json({ error: error.message });
  }
}