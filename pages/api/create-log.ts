import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { table_id, row_id, log, clerk_id } = req.body;
  try {
    const results = await query(
      `
      INSERT INTO log (table_id, row_id, log, clerk_id)
      VALUES (?, ?, ?, ?)
      `,
      [table_id, row_id, log, clerk_id]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
