import { AuthenticatedRequest, requireScope } from 'lib/api/utils'
import { dbGetStockItems } from 'lib/database/stock'
import { NextApiResponse } from 'next'

const apiRoute = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  const { items } = req.query
  try {
    if (items?.length === 0) return []
    const itemIds = `${items}`?.split(' ')
    return dbGetStockItems(itemIds).then((data) => {
      res.status(200).json(data)
    })
  } catch (error) {
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    })
  }
}

export default requireScope('clerk', apiRoute)
