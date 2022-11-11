import { query } from '@lib/database/db'
import { getCreateQuery } from '@lib/database/query'
import { NextApiHandler } from 'next'

// router.get('/', (req, res) => {
//   db.getTodos()
//     .then((todos) => res.json(todos))
//     .catch((err) => {
//       console.error(err.message)
//       res.status(500).send(err.message)
//     })
// })

const handler: NextApiHandler = async (req, res) => {
  const { properties, table, k } = req.body
  const { createQuery, values } = getCreateQuery(table, properties)
  try {
    if (k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: 'Resource Denied.' })
    const results = await query(createQuery, values)
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
