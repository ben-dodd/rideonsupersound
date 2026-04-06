import { AuthenticatedRequest, requireScope } from 'lib/api/utils'
import { dbGetClerk } from 'lib/database/clerk'
import { NextApiResponse } from 'next'

const apiRoute = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  console.log('clerk', req?.claims?.sub)

  try {
    return dbGetClerk(req?.claims?.sub).then((data) => res.status(200).json(data))
  } catch (error) {
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    })
  }
}

export default requireScope('clerk', apiRoute)
