import { NextApiHandler } from 'next'
import { query } from '../../lib/db'

const handler: NextApiHandler = async (req, res) => {
  const { start_date, end_date, k } = req.query
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: 'Resource Denied.' })
    const results = await query(
      `
      SELECT
       *
      FROM register
      WHERE open_date >= ?
      AND open_date <= ?
      `,
      [`${start_date}`, `${end_date}`]
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler

// -- LEFT JOIN (SELECT MAX(date_valid_from) AS date_valid_from, stock_id, vendor_cut, total_sell FROM stock_price GROUP BY stock_id) stock_price

// SELECT
// sale_item.id,
// sale_item.sale_id,
// sale_item.item_id,
// sale_item.quantity,
// sale_item.store_discount,
// sale_item.vendor_discount,
// sale_item.is_refunded,
// stock_price.vendor_cut,
// stock_price.total_sell,
// stock_price.date_valid_from AS date_price_valid_from,
// sale.date_sale_opened,
// sale.date_sale_closed,
// stock.vendor_id,
// sale.store_cut,
// sale.total_price,
// sale.number_of_items,
// sale.item_list,
// FROM register
// LEFT JOIN register_petty_cash
// ON register_petty_cash.register_id = register.id
// LEFT JOIN register_till AS open
// ON register_till.id = register.open_till_id
// LEFT JOIN register_till AS close
//   ON register_till.id = register.close_till_id
// WHERE register.open_date >= ?
// AND register.open_date <= ?
// AND register.is_deleted = 0
// AND sale_item.is_deleted = 0
