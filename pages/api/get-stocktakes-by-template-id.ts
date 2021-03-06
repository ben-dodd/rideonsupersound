import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { id } = req.query;
  try {
    const results = await query(
      `
      SELECT * FROM stocktake
      WHERE NOT is_deleted
      AND stocktake_template_id = ?
      ORDER BY date_started DESC
      `,
      id
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
