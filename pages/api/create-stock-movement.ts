import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { stock_id, clerk_id, quantity, act, note } = req.body;
  try {
    const results = await query(
      `
      INSERT INTO stock_movement (
        stock_id,
        clerk_id,
        quantity,
        act,
        note
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [stock_id, clerk_id, quantity, act, note]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
