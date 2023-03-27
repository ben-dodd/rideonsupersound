import { NextApiResponse } from 'next'
import { NextAuthenticatedApiRequest } from '@serverless-jwt/next/dist/types'
import { dbGetCurrentRegisterId } from 'lib/database/register'
import { requireScope } from 'lib/api/utils'

const apiRoute = async (req: NextAuthenticatedApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET')
    try {
      return dbGetCurrentRegisterId().then((data) => res.status(200).json(data))
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
}

// export default apiRoute
export default requireScope('clerk', apiRoute)
