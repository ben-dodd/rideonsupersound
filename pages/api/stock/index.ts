import { AuthenticatedApiRequest, requireScope } from 'lib/api/utils'
import { dbCreateStockItem, dbGetStockList, dbGetStockListPaginated } from 'lib/database/stock'
import { NextApiResponse } from 'next'

const apiRoute = async (req: AuthenticatedApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const hasPaginationParams = Object.keys(req.query).length > 0

    if (hasPaginationParams) {
      const { page = '0', pageSize = '50', sortBy = 'dateModified', sortDir = 'desc', search = '' } = req.query
      try {
        return dbGetStockListPaginated({
          page: parseInt(page as string, 10),
          pageSize: parseInt(pageSize as string, 10),
          sortBy: sortBy as string,
          sortDir: sortDir as 'asc' | 'desc',
          search: search as string,
        }).then((data) => res.status(200).json(data))
      } catch (error) {
        res.status(error.status || 500).json({
          code: error.code,
          error: error.message,
        })
      }
    } else {
      try {
        return dbGetStockList().then((data) => res.status(200).json(data))
      } catch (error) {
        res.status(error.status || 500).json({
          code: error.code,
          error: error.message,
        })
      }
    }
  } else if (req.method === 'POST')
    try {
      return dbCreateStockItem(req.body).then((data) => res.status(200).json(data))
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
}

export default requireScope('clerk', apiRoute)