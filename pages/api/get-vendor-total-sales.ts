import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { customer_id } = req.query;
  try {
    const results = await query(
      `
      SELECT
        sale_item.sale_id,
        sale_item.item_id,
        sale_item.quantity,
        sale_item.vendor_discount,
        stock_price.vendor_cut,
        stock_price.total_sell,
        stock_price.date_valid_from AS date_price_valid_from,
        sale.date_sale_opened,
        sale.date_sale_closed
      FROM sale_item
      LEFT JOIN sale
        ON sale.id = sale_item.sale_id
      LEFT JOIN stock_price
        ON stock_price.stock_id = sale_item.item_id
      WHERE sale_item.item_id IN
        (SELECT id FROM stock
          WHERE vendor_id IN
            (SELECT id FROM vendor
              WHERE customer_id = ?
            )
          )
      AND stock_price.date_valid_from <= sale.date_sale_opened
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
