import { AuthenticatedRequest, requireScope, withErrorHandling } from 'lib/api/utils'
import { dbGetStockItemsForVendor } from 'lib/database/stock'
import { NextApiResponse } from 'next'

const getHandler = async (req, res) => {
  const { id } = req.query
  const data = await dbGetStockItemsForVendor(id)
  res.status(200).json(data)
}

const apiRoute = withErrorHandling((req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return getHandler(req, res)
  }
})

export default requireScope('clerk', apiRoute)
