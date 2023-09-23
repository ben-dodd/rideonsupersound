import { NextApiResponse } from 'next'
import { requireScope } from 'lib/api/utils'
import { NextAuthenticatedApiRequest } from '@serverless-jwt/next/dist/types'
import { dbSaveCart } from 'lib/database/sale'

const apiRoute = async (req: NextAuthenticatedApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST')
    try {
      const cart = req.body
      return dbSaveCart(cart)
        .then((data) => res.status(200).json(data))
        .catch((e) => console.error(e))
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
}

export default requireScope('clerk', apiRoute)