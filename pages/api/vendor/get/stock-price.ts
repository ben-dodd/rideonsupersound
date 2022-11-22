import { query } from 'lib/database/db'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const { uid } = req.query
  try {
    const results = await query(
      `
      SELECT * FROM stock_price
      WHERE stock_id IN (
        SELECT id FROM stock WHERE vendor_id=(
          SELECT id FROM vendor WHERE uid = ?
        )
      ) ORDER BY date_valid_from DESC
      `,
      uid
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
