import { AuthenticatedRequest, requireScope } from 'lib/api/utils'
import { dbGetReceiveBatches } from 'lib/database/stock'
import { NextApiResponse } from 'next'

const apiRoute = async (req: AuthenticatedRequest, res: NextApiResponse) => {
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
