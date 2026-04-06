import { AuthenticatedRequest, requireScope } from 'lib/api/utils'
import { dbGetGiftCards } from 'lib/database/stock'
import { NextApiResponse } from 'next'

const apiRoute = async (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => {
  if (req.method === 'GET')
    try {
      return dbGetGiftCards().then((data) => res.status(200).json(data))
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
}

export default requireScope('clerk', apiRoute)
