import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.body;

    const count = await sql`
      SELECT COUNT(*) FROM payments WHERE status = 'approved'
    `;

    const approvedCount = parseInt(count[0].count);

    if (approvedCount >= 80) {
      return res.status(400).json({ message: 'Tickets sold out' });
    }

    const ticketCode = `7DEC-${(approvedCount + 1)
      .toString()
      .padStart(3, '0')}`;

    await sql`
      UPDATE payments
      SET status = 'approved',
          ticket_code = ${ticketCode}
      WHERE id = ${id}
    `;

    res.status(200).json({ message: 'Approved' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
