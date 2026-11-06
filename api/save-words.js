import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const { words, tipo } = req.body;
  
  if (!words || !Array.isArray(words)) {
    return res.status(400).json({ error: 'No words provided' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // 1. Limpiamos las palabras anteriores del tipo especificado
    await sql`DELETE FROM vocabulario WHERE tipo = ${tipo}`;

    // 2. Si hay palabras válidas, las insertamos
    for (const item of words) {
      const en = item.en || item.ingles || '';
      const es = item.es || item.espanol || '';
      const past = item.past || item.pasado || null;
      const participle = item.participle || item.participio || null;

      if (en.trim() !== '' && es.trim() !== '') {
        await sql`
          INSERT INTO vocabulario (ingles, espanol, pasado, participio, tipo)
          VALUES (${en}, ${es}, ${past}, ${participle}, ${tipo})
        `;
      }
    }

    return res.status(200).json({ success: true, count: words.length });
  } catch (error) {
    console.error("Error al guardar en Neon:", error);
    return res.status(500).json({ error: error.message });
  }
}