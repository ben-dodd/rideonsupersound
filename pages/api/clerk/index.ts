import { dbGetClerk } from 'lib/database/clerk'
import { NextApiResponse } from 'next'
import { requireScope } from 'lib/api/utils'
import { NextAuthenticatedApiRequest } from '@serverless-jwt/next/dist/types'

const apiRoute = async (req: NextAuthenticatedApiRequest, res: NextApiResponse) => {
  console.log('clerk', req?.identityContext?.claims?.sub)

  try {
    return dbGetClerk(req?.identityContext?.claims?.sub).then((data) => res.status(200).json(data))
  } catch (error) {
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    })
  }
}

export default requireScope('clerk', apiRoute)
