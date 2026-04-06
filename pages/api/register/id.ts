import { AuthenticatedRequest, requireScope } from 'lib/api/utils'
import { dbGetCurrentRegisterId } from 'lib/database/register'
import { NextApiResponse } from 'next'

const apiRoute = async (req: AuthenticatedRequest, res: NextApiResponse) => {
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
