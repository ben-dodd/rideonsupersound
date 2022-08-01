import { query } from 'lib/database/db'
import { getReadQuery } from 'lib/database/query'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const { k, columns, table, where, orderBy, isDesc, limit } = req.query
  const { readQuery } = getReadQuery({
    columns,
    table,
    where,
    orderBy,
    isDesc,
    limit,
  })
  try {
    if (k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: 'Resource Denied.' })
    const results = await query(readQuery)
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
