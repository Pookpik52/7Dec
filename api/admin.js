import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    const payments = await sql`
      SELECT * FROM payments ORDER BY id DESC
    `;

    res.status(200).json({ payments });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
