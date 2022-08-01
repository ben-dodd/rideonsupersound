import { query } from 'lib/database/db'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const { k } = req.query
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: 'Resource Denied.' })
    const results = await query(
      `
      SELECT
        s.id,
        s.artist,
        s.title,
        s.display_as,
        s.is_gift_card,
        s.gift_card_code,
        s.gift_card_amount,
        s.is_misc_item,
        s.misc_item_description,
        s.misc_item_amount,
        p.vendor_cut,
        p.total_sell,
        q.quantity
      FROM stock AS s
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity FROM stock_movement GROUP BY stock_id) AS q
        ON q.stock_id = s.id
      LEFT JOIN stock_price AS p ON p.stock_id = s.id
      WHERE
         (p.id = (
            SELECT MAX(id)
            FROM stock_price
            WHERE stock_id = s.id
         ) OR s.is_gift_card OR s.is_misc_item)
      AND NOT is_deleted
      `
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
