import { AuthenticatedApiRequest, requireScope } from 'lib/api/utils'
import { dbGetClerk } from 'lib/database/clerk'
import { NextApiResponse } from 'next'

const apiRoute = async (req: AuthenticatedApiRequest, res: NextApiResponse) => {
  console.log('clerk', req?.user?.sub)

  try {
    return dbGetClerk(req?.user?.sub).then((data) => res.status(200).json(data))
  } catch (error: any) {
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    })
  }
}

export default requireScope('clerk', apiRoute)
