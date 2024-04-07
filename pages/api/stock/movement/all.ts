import { NextApiResponse } from 'next'
import { requireScope, withErrorHandling } from 'lib/api/utils'
import { NextAuthenticatedApiRequest } from '@serverless-jwt/next/dist/types'
import { dbGetAllStockMovements } from 'lib/database/stock'

const getHandler = async (req, res) => {
  const data = await dbGetAllStockMovements()
  res.status(200).json(data)
}

const apiRoute = withErrorHandling((req: NextAuthenticatedApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return getHandler(req, res)
  }
})

export default requireScope('clerk', apiRoute)
