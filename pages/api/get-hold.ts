import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { hold_id } = req.query;
  try {
    const results = await query(
      `
      SELECT *
      FROM hold
      WHERE id = ?
      `,
      contact_id
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
