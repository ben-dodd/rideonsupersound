import { NextApiResponse } from 'next'
import { requireScope, withErrorHandling } from 'lib/api/utils'
import { AuthenticatedApiRequest } from 'lib/api/utils'
import { dbUpdateJob } from 'lib/database/jobs'

const patchHandler = async (req, res) => {
  const { id } = req.query
  const data = await dbUpdateJob(req.body, id)
  res.status(200).json(data)
}

const apiRoute = withErrorHandling((req: AuthenticatedApiRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    return patchHandler(req, res)
  }
})

export default requireScope('clerk', apiRoute)
