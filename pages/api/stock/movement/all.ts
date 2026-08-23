import { NextApiResponse } from 'next'
import { requireScope, withErrorHandling } from 'lib/api/utils'
import { AuthenticatedApiRequest } from 'lib/api/utils'
import { dbGetAllStockMovements } from 'lib/database/stock'

const getHandler = async (req, res) => {
  const data = await dbGetAllStockMovements()
  res.status(200).json(data)
}

const apiRoute = withErrorHandling((req: AuthenticatedApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return getHandler(req, res)
  }
})

export default requireScope('clerk', apiRoute)
