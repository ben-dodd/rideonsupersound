import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { register_id } = req.query;
  try {
    const results = await query(
      `
      SELECT *
      FROM register_petty_cash
      WHERE register_id = ${register_id}
      `
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
