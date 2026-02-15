import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email } = req.body;

try {

  const count = await sql`
    SELECT COUNT(*) FROM payments WHERE status = 'approved';
  `;

  if (parseInt(count[0].count) >= 80) {
    return res.status(400).json({ message: "Tickets sold out" });
  }

await sql`
  INSERT INTO payments (name, email, status)
  VALUES (${name}, ${email}, 'pending');
`;


  return res.status(200).json({ message: "Saved successfully" });

} catch (error) {
  return res.status(500).json({ error: error.message });
}

  }

  return res.status(405).json({ message: 'Method not allowed' });
}
