import { NextApiHandler } from 'next'
import { query } from '../../lib/db'

const handler: NextApiHandler = async (req, res) => {
  const { k } = req.query
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: 'Resource Denied.' })
    const results = await query(
      `
      SELECT
        id,
        customer_id,
        state,
        date_sale_opened,
        sale_opened_by,
        date_sale_closed,
        sale_closed_by,
        store_cut,
        total_price,
        number_of_items,
        item_list,
        is_mail_order,
        postage,
        postal_address,
        note
      FROM sale
      WHERE NOT is_deleted
      `
    )

    // weather,

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
