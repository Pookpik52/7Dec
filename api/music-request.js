import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, style, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    await sql`
      INSERT INTO music_requests (name, email, style, message)
      VALUES (${name}, ${email}, ${style}, ${message})
    `;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}
