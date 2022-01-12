import { NextApiHandler } from "next";
import { query } from "../../lib/db";
import { escape } from "sqlstring";

const handler: NextApiHandler = async (req, res) => {
  const {
    sale_item_id,
    sale_id,
    item_id,
    quantity,
    vendor_discount,
    store_discount,
    note,
    is_refunded,
    refund_note,
    date_refunded,
    is_deleted,
  } = req.body;
  const { k } = req.query;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
      UPDATE sale_item
      SET
        sale_id = ?,
        item_id = ?,
        quantity = ?,
        vendor_discount = ?,
        store_discount = ?,
        note = ?,
        is_refunded = ?,
        refund_note = ?,
        date_refunded = ?,
        is_deleted = ?
      WHERE id = ?
      `,
      [
        sale_id,
        item_id,
        quantity,
        vendor_discount,
        store_discount,
        note,
        is_refunded,
        refund_note,
        date_refunded,
        is_deleted,
        sale_item_id,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
