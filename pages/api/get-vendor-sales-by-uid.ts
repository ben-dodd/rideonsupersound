import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { uid } = req.query;
  try {
    const results = await query(
      `
      SELECT
        sale_item.sale_id,
        sale_item.item_id,
        sale_item.quantity,
        sale_item.store_discount,
        sale_item.vendor_discount,
        stock_price.vendor_cut,
        stock_price.total_sell,
        stock_price.date_valid_from AS date_price_valid_from,
        sale.date_sale_opened,
        sale.date_sale_closed,
        stock.vendor_id,
        sale.store_cut,
        sale.total_price,
        sale.number_of_items,
        sale.item_list
      FROM sale_item
      LEFT JOIN stock
        ON sale_item.item_id = stock.id
      LEFT JOIN sale
        ON sale.id = sale_item.sale_id
      LEFT JOIN stock_price
        ON stock_price.stock_id = sale_item.item_id
      AND stock_price.date_valid_from <= sale.date_sale_opened
      AND sale.state = 'completed'
      AND sale.is_deleted = 0
      AND sale_item.is_deleted = 0
      AND stock.vendor_id = (
        SELECT id FROM vendor WHERE uid = ?
        )
      `,
      uid
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
