import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  const { id } = req.body;

  try {
    // 🔥 นับจำนวนที่ approved แล้ว
    const count = await sql`
      SELECT COUNT(*) FROM payments WHERE status = 'approved';
    `;

    if (parseInt(count[0].count) >= 80) {
      return res.status(400).json({ message: "Tickets sold out" });
    }

    // 🔥 สร้าง ticket code
    const ticketNumber = parseInt(count[0].count) + 1;
    const ticketCode = `7DEC-${ticketNumber.toString().padStart(4, '0')}`;

    // 🔥 update status + ticket_code
    await sql`
      UPDATE payments
      SET status = 'approved',
          ticket_code = ${ticketCode}
      WHERE id = ${id};
    `;

    return res.status(200).json({ message: "Approved" });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
