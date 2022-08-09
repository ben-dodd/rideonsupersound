import { query } from '@lib/database/db'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const { vendor_id, k } = req.query
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: 'Resource Denied.' })
    const results = await query(
      `
      SELECT
        sale_item.sale_id,
        sale_item.item_id,
        sale_item.quantity,
        sale_item.vendor_discount,
        sale_item.store_discount,
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
          WHERE vendor_id = ?
        )
      AND stock_price.date_valid_from <= sale.date_sale_opened
      AND sale.state = 'completed'
      AND sale.is_deleted = 0
      AND sale_item.is_deleted = 0
      `,
      vendor_id
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler

// -- LEFT JOIN (SELECT MAX(date_valid_from) AS date_valid_from, stock_id, vendor_cut, total_sell FROM stock_price GROUP BY stock_id) stock_price
