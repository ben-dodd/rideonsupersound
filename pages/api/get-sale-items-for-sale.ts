import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { sale_id } = req.query;
  try {
    const results = await query(
      `
      SELECT
        sale.date_sale_opened,
        sale.date_sale_closed,
        sale_item.id,
        sale_item.sale_id,
        sale_item.item_id,
        sale_item.quantity,
        sale_item.vendor_discount,
        stock_price.vendor_cut,
        stock_price.total_sell,
        stock_price.date_valid_from AS date_price_valid_from
      FROM sale
      LEFT JOIN sale_item
        ON sale_item.sale_id = sale.id
      LEFT JOIN stock_price
        ON stock_price.stock_id = sale_item.item_id
      WHERE sale.id = ?
      AND stock_price.date_valid_from <= sale.date_sale_opened
      AND sale.is_deleted = 0
      AND sale_item.is_deleted = 0
      `,
      sale_id
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
