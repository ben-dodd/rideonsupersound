import { dbGetCustomers, dbCreateCustomer } from 'lib/database/customer'
import { NextApiResponse } from 'next'
import { requireScope } from 'lib/api/utils'
import { NextAuthenticatedApiRequest } from '@serverless-jwt/next/dist/types'

const apiRoute = async (
  req: NextAuthenticatedApiRequest,
  res: NextApiResponse
) => {
  console.log(req)
  if (req.method === 'GET')
    try {
      return dbGetCustomers().then((data) => res.status(200).json(data))
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
  else if (req.method === 'POST')
    try {
      return dbCreateCustomer(req.body).then((data) =>
        res.status(200).json(data)
      )
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
}

export default requireScope('clerk', apiRoute)
