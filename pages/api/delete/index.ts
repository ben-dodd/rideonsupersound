import { query } from 'lib/database/db'
import { getDeleteQuery } from 'lib/database/query'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const { table, id, id_key, isHardDelete, k } = req.body
  const { deleteQuery, values } = getDeleteQuery(
    table,
    id,
    id_key,
    isHardDelete
  )
  try {
    if (k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: 'Resource Denied.' })
    const results = await query(deleteQuery, values)
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
