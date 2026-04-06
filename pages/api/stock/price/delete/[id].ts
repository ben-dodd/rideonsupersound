import { AuthenticatedRequest, requireScope } from 'lib/api/utils'
import { dbDeleteStockPrice } from 'lib/database/stock'
import { NextApiResponse } from 'next'

const apiRoute = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    const { id } = req.query
    try {
      return dbDeleteStockPrice(id).then((data) => res.status(200).json(data))
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
  }
}

export default requireScope('clerk', apiRoute)
