import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  console.log(req.body);
  const { sale_id } = req.body;
  try {
    const results = await query(
      // `
      // DELETE FROM sale_item WHERE sale_id = ? AND item_id = ?
      // `,
      `
      UPDATE sale SET is_deleted = 0 WHERE sale_id = ?
      `,
      [sale_id]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
