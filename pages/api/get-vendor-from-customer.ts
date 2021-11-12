import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { customer_id } = req.query;
  try {
    const results = await query(
      `
      SELECT *
      FROM vendor
      WHERE customer_id = ?
      `,
      customer_id
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;