import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email } = req.body;

    await sql`
      INSERT INTO payments (name, email, status)
      VALUES (${name}, ${email}, 'pending');
    `;

    return res.status(200).json({ message: 'Saved successfully' });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
