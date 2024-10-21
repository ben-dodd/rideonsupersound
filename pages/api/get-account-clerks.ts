import { NextApiHandler } from 'next'
import { query } from '../../lib/db'

const handler: NextApiHandler = async (req, res) => {
  const { account_id, k } = req.query
  try {
    if (k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: 'Resource Denied.' })
    const results = await query(
      `
      SELECT *
      FROM clerk
      WHERE id IN (
        SELECT clerk_id
        FROM account_clerk
        WHERE account_id = ?
      )
      AND is_current = 1
      ORDER BY colour
      `,
      account_id
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
