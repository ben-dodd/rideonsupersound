import { NextApiResponse } from 'next'
import { requireScope } from 'lib/api/utils'
import { AuthenticatedApiRequest } from 'lib/api/utils'
import { dbCreateStockPrice } from 'lib/database/stock'

const apiRoute = async (req: AuthenticatedApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST')
    try {
      return dbCreateStockPrice(req.body).then((data) => res.status(200).json(data))
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
}

export default requireScope('clerk', apiRoute)
