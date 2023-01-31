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
        vendor_id,
        artist,
        title,
        display_as,
        media,
        format
      FROM stock
      WHERE NOT is_deleted
      AND (NOT is_misc_item
      OR is_misc_item IS NULL)
      AND (NOT is_gift_card
      OR is_gift_card IS NULL)
      `
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
