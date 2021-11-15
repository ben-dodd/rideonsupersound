import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { vendor_id } = req.query;
  try {
    const results = await query(
      `
      SELECT date, amount
      FROM vendor_payment
      WHERE vendor_id = ?
      `,
      vendor_id
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
