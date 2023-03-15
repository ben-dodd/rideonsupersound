import { NextApiHandler } from 'next'
import { query } from '../../lib/db'

const handler: NextApiHandler = async (req, res) => {
  const { k } = req.query
  const { sale_id } = req.body
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: 'Resource Denied.' })
    const results = await query(
      `
      DELETE FROM stock_movement WHERE sale_id = ?
      `,
      // `
      // UPDATE stock_movement SET is_deleted = 1 WHERE sale_id = ?
      // `,
      [sale_id]
    )
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
