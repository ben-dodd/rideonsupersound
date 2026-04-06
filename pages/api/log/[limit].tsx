import { AuthenticatedRequest, requireScope, withErrorHandling } from 'lib/api/utils'
import { dbGetLogs } from 'lib/database/log'
import { NextApiResponse } from 'next'

const getHandler = async (req, res) => {
  const { limit } = req.query
  const data = await dbGetLogs(limit)
  res.status(200).json(data)
}

const apiRoute = withErrorHandling((req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return getHandler(req, res)
  }
})

export default requireScope('clerk', apiRoute)
