import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { stock_id, clerk_id, vendor_cut, total_sell, note } = req.body;
  try {
    const results = await query(
      `
      INSERT INTO stock_price (
        stock_id,
        clerk_id,
        vendor_cut,
        total_sell,
        note
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [stock_id, clerk_id, vendor_cut, total_sell, note]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
