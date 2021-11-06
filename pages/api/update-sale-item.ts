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
    is_deleted,
  } = req.body;
  try {
    const results = await query(
      `
      UPDATE sale_item
      SET
        sale_id = ${sale_id || null},
        item_id = ${item_id || null},
        quantity = ${quantity || null},
        vendor_discount = ${vendor_discount || null},
        store_discount = ${store_discount || null},
        note = ${escape(note)},
        is_refunded = ${is_refunded || 0}
        is_deleted = ${is_deleted || 0}
      WHERE id = ${sale_item_id}
      `
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
