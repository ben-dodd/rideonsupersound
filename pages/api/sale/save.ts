import { NextApiResponse } from 'next'
import { requireScope } from 'lib/api/utils'
import { NextAuthenticatedApiRequest } from '@serverless-jwt/next/dist/types'
import { dbSaveSale } from 'lib/database/sale'

const apiRoute = async (
  req: NextAuthenticatedApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST')
    try {
      const { sale, prevState } = req.body
      return dbSaveSale(sale, prevState).then((data) =>
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
