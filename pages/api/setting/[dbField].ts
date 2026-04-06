import { AuthenticatedRequest, requireScope } from 'lib/api/utils'
import { dbGetSetting } from 'lib/database/setting'
import { NextApiResponse } from 'next'

const apiRoute = async (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => {
  const { dbField } = req.query
  try {
    return dbGetSetting(dbField).then((data) => res.status(200).json(data))
  } catch (error) {
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    })
  }
}

export default requireScope('clerk', apiRoute)
