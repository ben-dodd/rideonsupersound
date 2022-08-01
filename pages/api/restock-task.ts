import { NextApiHandler } from 'next'
import { query } from '../../lib/database/db'

const handler: NextApiHandler = async (req, res) => {
  const { id, needs_restock } = req.body
  const { k } = req.query
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: 'Resource Denied.' })
    const results = await query(
      `
        UPDATE stock
        SET
          needs_restock = ?
        WHERE id = ?
      `,
      [needs_restock ? 1 : 0, id]
    )
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
