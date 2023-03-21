import { NextApiResponse } from 'next'
import { requireScope, withErrorHandling } from 'lib/api/utils'
import { NextAuthenticatedApiRequest } from '@serverless-jwt/next/dist/types'
import { dbUpdateJob } from 'lib/database/jobs'

const patchHandler = async (req, res) => {
  const { id } = req.query
  const data = await dbUpdateJob(req.body, id)
  res.status(200).json(data)
}

const apiRoute = withErrorHandling((req: NextAuthenticatedApiRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    return patchHandler(req, res)
  }
})

export default requireScope('clerk', apiRoute)
