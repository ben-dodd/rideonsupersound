import { query } from 'lib/database/db'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const { uid } = req.query
  try {
    const results = await query(
      `
      SELECT
        sale_item.sale_id,
        sale_item.item_id,
        sale_item.quantity,
        sale_item.is_refunded,
        sale_item.store_discount,
        sale_item.vendor_discount,
        sale.date_sale_closed,
        stock.vendor_id
      FROM sale_item
      LEFT JOIN stock
        ON sale_item.item_id = stock.id
      LEFT JOIN sale
        ON sale.id = sale_item.sale_id        
      WHERE sale.state = 'completed'
      AND NOT sale.is_deleted
      AND NOT sale_item.is_deleted
      AND stock.vendor_id = (
        SELECT id FROM vendor WHERE uid = ?
        )
        ORDER BY sale.date_sale_closed DESC
      `,
      uid
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
