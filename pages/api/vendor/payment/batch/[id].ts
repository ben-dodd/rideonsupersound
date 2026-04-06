import { AuthenticatedRequest, requireScope } from 'lib/api/utils'
import { dbDeleteBatchPayment, dbGetBatchVendorPayment } from 'lib/database/vendor'
import { NextApiResponse } from 'next'

const apiRoute = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const { id } = req.query
      return dbGetBatchVendorPayment(id).then((data) => res.status(200).json(data))
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query
    try {
      return dbDeleteBatchPayment(Number(id)).then((data) => res.status(200).json(data))
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
  }
  // } else if (req.method === 'PATCH') {
  //   const { id } = req.query
  //   const batchPayment = req.body
  //   try {
  //     return dbUpdateBatchPayment(batchPayment, Number(id)).then((data) => res.status(200).json(data))
  //   } catch (error) {
  //     res.status(error.status || 500).json({
  //       code: error.code,
  //       error: error.message,
  //     })
  //   }
}

export default requireScope('clerk', apiRoute)
