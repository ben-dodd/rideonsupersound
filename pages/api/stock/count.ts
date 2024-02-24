import { NextApiResponse } from 'next'
import { requireScope } from 'lib/api/utils'
import { NextAuthenticatedApiRequest } from '@serverless-jwt/next/dist/types'
import { dbGetStockCount } from 'lib/database/stock'

const apiRoute = async (req: NextAuthenticatedApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      return dbGetStockCount().then((data) => res.status(200).json(data))
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
  }
}

export default requireScope('clerk', apiRoute)
