import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { dbGetWebStock } from 'lib/database/stock'

const apiRoute: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'GET')
    try {
      return dbGetWebStock().then((data) => res.status(200).json(data))
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
}

export default apiRoute
