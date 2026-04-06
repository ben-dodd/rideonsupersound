import { AuthenticatedRequest, requireScope } from 'lib/api/utils'
import { dbGetSalesList } from 'lib/database/sale'
import { NextApiResponse } from 'next'

const apiRoute = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method === 'GET')
    try {
      const { startDate, endDate, clerks, laybysOnly } = req.query
      return dbGetSalesList(startDate, endDate, clerks, Boolean(laybysOnly)).then((data) => res.status(200).json(data))
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
}

export default requireScope('clerk', apiRoute)
