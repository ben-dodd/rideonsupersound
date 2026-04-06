import { AuthenticatedRequest, requireScope } from 'lib/api/utils'
import { dbCloseRegister } from 'lib/database/register'
import { NextApiResponse } from 'next'

const apiRoute = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  try {
    const { id, register, till } = req.body
    return dbCloseRegister(id, register, till).then((data) => res.status(200).json(data))
  } catch (error) {
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    })
  }
}

export default requireScope('clerk', apiRoute)
