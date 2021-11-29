import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { id, needs_restock } = req.body;
  try {
    const results = await query(
      `
        UPDATE stock
        SET
          needs_restock = ${needs_restock ? 1 : 0}
        WHERE id = ${id}
      `
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
