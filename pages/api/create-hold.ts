import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { contact_id, hold_period, started_by, note } = req.body;
  try {
    const results = await query(
      `
      INSERT INTO hold (contact_id, hold_period, started_by, note)
      VALUES (?, ?, ?, ?)
      `,
      [contact_id, hold_period, started_by, note]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
