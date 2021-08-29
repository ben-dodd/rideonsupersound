import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  console.log(req.body);
  const {
    hold_id,
    item_id,
    quantity,
    vendor_discount,
    store_discount,
  } = req.body;
  try {
    const results = await query(
      `
      INSERT INTO hold_item (hold_id, item_id, quantity, vendor_discount, store_discount)
      VALUES (?, ?, ?, ?, ?)
      `,
      [hold_id, item_id, quantity, vendor_discount, store_discount]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
