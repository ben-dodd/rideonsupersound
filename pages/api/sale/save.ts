import { AuthenticatedRequest, requireScope } from 'lib/api/utils'
import { dbSaveCart } from 'lib/database/sale'
import { NextApiResponse } from 'next'

const apiRoute = async (req: AuthenticatedRequest, res: NextApiResponse) => {
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
