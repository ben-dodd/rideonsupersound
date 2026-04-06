import { AuthenticatedRequest, requireScope, withErrorHandling } from 'lib/api/utils'
import { dbGetStockMovements } from 'lib/database/stock'
import { NextApiResponse } from 'next'

const getHandler = async (req, res) => {
  const { limit } = req.query
  const data = await dbGetStockMovements(limit)
  res.status(200).json(data)
}

const apiRoute = withErrorHandling((req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return getHandler(req, res)
  }
})

export default requireScope('clerk', apiRoute)
