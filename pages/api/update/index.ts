import { query } from '@lib/database/db'
import { getUpdateQuery } from '@lib/database/query'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const { properties, table, id, k } = req.body
  const { updateQuery, values } = getUpdateQuery(table, properties, id)
  try {
    if (k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: 'Resource Denied.' })
    if (id === null || id === undefined)
      return res.status(401).json({ message: 'ID not given.' })
    const results = await query(updateQuery, values)
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
