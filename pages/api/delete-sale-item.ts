import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { sale_item_id } = req.body;
  try {
    const results = await query(
      // `
      // DELETE FROM sale_item WHERE sale_id = ? AND item_id = ?
      // `,
      `
      UPDATE sale_item SET is_deleted = 1 WHERE id = ?
      `,
      [sale_item_id]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
