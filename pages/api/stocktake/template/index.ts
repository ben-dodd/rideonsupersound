import { AuthenticatedRequest, requireScope } from 'lib/api/utils'
import {
  dbCreateStocktakeTemplate,
  dbGetStocktakeTemplates,
} from 'lib/database/stock'
import { NextApiResponse } from 'next'

const apiRoute = async (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => {
  if (req.method === 'GET')
    try {
      return dbGetStocktakeTemplates().then((data) =>
        res.status(200).json(data)
      )
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
  else if (req.method === 'POST') {
    const { stocktakeTemplate } = req.body
    try {
      return dbCreateStocktakeTemplate(stocktakeTemplate).then((data) =>
        res.status(200).json(data)
      )
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
  }
}

export default requireScope('clerk', apiRoute)
