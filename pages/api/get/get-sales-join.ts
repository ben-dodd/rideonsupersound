import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { customer_id, k } = req.query;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
      SELECT
        sale_item.id,
        sale_item.sale_id,
        sale_item.item_id,
        sale_item.quantity,
        sale_item.store_discount,
        sale_item.vendor_discount,
        sale_item.is_refunded,
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
      WHERE stock_price.date_valid_from <= sale.date_sale_opened
      AND sale.state = 'completed'
      AND sale.is_deleted = 0
      AND sale_item.is_deleted = 0
      `,
      customer_id
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;

// -- LEFT JOIN (SELECT MAX(date_valid_from) AS date_valid_from, stock_id, vendor_cut, total_sell FROM stock_price GROUP BY stock_id) stock_price
