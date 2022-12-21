import { NextApiResponse } from 'next'
import { requireScope } from 'lib/api/utils'
import { NextAuthenticatedApiRequest } from '@serverless-jwt/next/dist/types'
import { dbGetStockItems } from 'lib/database/stock'

const apiRoute = async (
  req: NextAuthenticatedApiRequest,
  res: NextApiResponse
) => {
  const { items } = req.query
  try {
    if (items?.length === 0) return []
    const itemIds = `${items}`?.split(' ')
    console.log(itemIds)
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
