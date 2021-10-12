import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { opened_by_id, open_amount, open_note, open_till_id } = req.body;
  try {
    const results = await query(
      `
      INSERT INTO register (
        opened_by_id,
        open_amount,
        open_note,
        open_till_id
      )
      VALUES (?, ?, ?, ?)
      `,
      [opened_by_id, open_amount, open_note, open_till_id]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
