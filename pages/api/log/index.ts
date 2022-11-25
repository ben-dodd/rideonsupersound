import { NextApiResponse } from 'next'
import { requireScope } from 'lib/swr/utils'
import { NextAuthenticatedApiRequest } from '@serverless-jwt/next/dist/types'
import { getLogs } from 'lib/database/log'

const apiRoute = async (
  req: NextAuthenticatedApiRequest,
  res: NextApiResponse
) => {
  try {
    return getLogs().then((data) => res.status(200).json(data))
  } catch (error) {
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    })
  }
}

export default requireScope('admin', apiRoute)
