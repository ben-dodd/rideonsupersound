import { AuthenticatedRequest, requireScope } from 'lib/api/utils'
import { dbGetSale, dbUpdateSaleItem } from 'lib/database/sale'
import { NextApiResponse } from 'next'

const apiRoute = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { id } = req.query
    try {
      return dbGetSale(id).then((data) => res.status(200).json(data))
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
  } else if (req.method === 'PATCH') {
    const { id } = req.query
    const update = req.body
    try {
      return dbUpdateSaleItem(id, update).then((data) => res.status(200).json(data))
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
  }
}

export default requireScope('clerk', apiRoute)
