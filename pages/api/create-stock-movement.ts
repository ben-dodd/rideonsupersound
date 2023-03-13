import { NextApiHandler } from 'next'
import { query } from '../../lib/db'

const handler: NextApiHandler = async (req, res) => {
  const { k } = req.query
  const {
    stock_id,
    clerk_id,
    register_id,
    quantity,
    act,
    note,
    sale_id,
    stocktake_id,
    date_moved,
  } = req.body
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: 'Resource Denied.' })
    const results = await query(
      `
      INSERT INTO stock_movement (
        stock_id,
        clerk_id,
        register_id,
        quantity,
        act,
        note,
        sale_id,
        stocktake_id,
        date_moved
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        stock_id,
        clerk_id,
        register_id,
        quantity,
        act,
        note,
        sale_id,
        stocktake_id,
        date_moved,
      ]
    )
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
