import { AuthenticatedRequest, requireScope } from 'lib/api/utils'
import { dbGetVendor, dbUpdateVendor } from 'lib/database/vendor'
import { NextApiResponse } from 'next'

const apiRoute = async (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => {
  if (req.method === 'GET') {
    const { id } = req.query
    try {
      return dbGetVendor(id).then((data) => res.status(200).json(data))
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
  } else if (req.method === 'PATCH') {
    const { id } = req.query
    const vendor = req.body
    try {
      return dbUpdateVendor(vendor, id).then((data) =>
        res.status(200).json(data)
      )
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
  }
}

export default requireScope('clerk', apiRoute)
