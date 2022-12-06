import { dbGetClerks } from 'lib/database/clerk'
import { NextApiResponse } from 'next'
import { requireScope } from 'lib/api/utils'
import { NextAuthenticatedApiRequest } from '@serverless-jwt/next/dist/types'

const apiRoute = async (
  req: NextAuthenticatedApiRequest,
  res: NextApiResponse
) => {
  try {
    return dbGetClerks().then((data) => res.status(200).json(data))
  } catch (error) {
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    })
  }
}

export default requireScope('clerk', apiRoute)
