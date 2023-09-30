import { NextApiResponse } from 'next'
import { requireScope } from 'lib/api/utils'
import { NextAuthenticatedApiRequest } from '@serverless-jwt/next/dist/types'
import { dbGetReceiveBatches } from 'lib/database/stock'

const apiRoute = async (req: NextAuthenticatedApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      return dbGetReceiveBatches().then((data) => res.status(200).json(data))
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
    // } else if (req.method === 'PATCH')
    //   try {
    //     return dbReceiveStock(req.body).then((data) => res.status(200).json(data))
    //   } catch (error) {
    //     res.status(error.status || 500).json({
    //       code: error.code,
    //       error: error.message,
    //     })
  }
}

export default requireScope('clerk', apiRoute)
