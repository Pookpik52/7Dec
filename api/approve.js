import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.body || {};

    if (!id) {
      return res.status(400).json({ message: "Missing ID" });
    }

    const countResult = await sql`
      SELECT COUNT(*) FROM payments WHERE status = 'approved';
    `;

    const approvedCount = parseInt(countResult[0].count);

    if (approvedCount >= 80) {
      return res.status(400).json({ message: "Tickets sold out" });
    }

    const ticketNumber = approvedCount + 1;
    const ticketCode = `7DEC-${ticketNumber.toString().padStart(4, '0')}`;

    await sql`
      UPDATE payments
      SET status = 'approved',
          ticket_code = ${ticketCode}
      WHERE id = ${id};
    `;

    return res.status(200).json({ message: "Approved" });

  } catch (error) {
    console.error("Approve Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
