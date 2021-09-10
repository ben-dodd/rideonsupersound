import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const {
    sale_id,
    item_id,
    quantity,
    vendor_discount,
    store_discount,
    note,
  } = req.body;
  try {
    const results = await query(
      `
      INSERT INTO sale_item (
        sale_id,
        item_id,
        quantity,
        vendor_discount,
        store_discount,
        note
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [sale_id, item_id, quantity, vendor_discount, store_discount, note]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
