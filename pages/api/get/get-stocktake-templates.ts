import { query } from '@lib/database/db'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const { k } = req.query
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: 'Resource Denied.' })
    const results = await query(
      `
      SELECT *
      FROM stocktake_template
      WHERE NOT is_deleted
      `
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
