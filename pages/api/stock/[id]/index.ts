import { NextApiResponse } from 'next'
import { requireScope, withErrorHandling } from 'lib/api/utils'
import { NextAuthenticatedApiRequest } from '@serverless-jwt/next/dist/types'
import { dbGetStockItem, dbUpdateStockItem } from 'lib/database/stock'

const getHandler = async (req, res) => {
  const { id, basic } = req.query
  var startTime = performance.now()
  const data = await dbGetStockItem(id, Boolean(basic))
  var endTime = performance.now()
  console.log(`dbGetStockItem for ${id} took ${Math.round(endTime - startTime)} ms`)
  res.status(200).json(data)
}

const patchHandler = async (req, res) => {
  const { id } = req.query
  const data = await dbUpdateStockItem(req.body, id)
  res.status(200).json(data)
}

const apiRoute = withErrorHandling((req: NextAuthenticatedApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return getHandler(req, res)
  } else if (req.method === 'PATCH') {
    return patchHandler(req, res)
  }
})

export default requireScope('clerk', apiRoute)
