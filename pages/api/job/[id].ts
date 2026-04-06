import { AuthenticatedRequest, requireScope, withErrorHandling } from 'lib/api/utils'
import { dbUpdateJob } from 'lib/database/jobs'
import { NextApiResponse } from 'next'

const patchHandler = async (req, res) => {
  const { id } = req.query
  const data = await dbUpdateJob(req.body, id)
  res.status(200).json(data)
}

const apiRoute = withErrorHandling((req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    return patchHandler(req, res)
  }
})

export default requireScope('clerk', apiRoute)
