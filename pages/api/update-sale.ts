import { NextApiHandler } from "next";
import { query } from "../../lib/db";
import { escape } from "sqlstring";

const handler: NextApiHandler = async (req, res) => {
  const {
    sale_id,
    customer_id,
    state,
    note,
    date_layby_started,
    layby_started_by,
    date_sale_closed,
    sale_closed_by,
    store_cut,
    total_price,
    number_of_items,
    item_list,
    is_mail_order,
    postage,
    postal_address,
  } = req.body;
  const { k } = req.query;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
      UPDATE sale
      SET
        customer_id = ?,
        state = ?,
        note = ?,
        date_layby_started = ?,
        layby_started_by = ?,
        date_sale_closed = ?,
        sale_closed_by = ?,
        store_cut = ?,
        total_price = ?,
        number_of_items = ?,
        item_list = ?,
        is_mail_order = ?,
        postage = ?,
        postal_address = ?
      WHERE id = ?
      `,
      [
        customer_id,
        state,
        note,
        date_layby_started,
        layby_started_by,
        date_sale_closed,
        sale_closed_by,
        store_cut,
        total_price,
        number_of_items,
        item_list,
        is_mail_order,
        postage,
        postal_address,
        sale_id,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
