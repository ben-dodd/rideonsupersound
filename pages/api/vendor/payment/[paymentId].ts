import { AuthenticatedRequest, requireScope } from 'lib/api/utils'
import { dbDeleteVendorPayment, dbGetVendorFromVendorPayment } from 'lib/database/vendor'
import { NextApiResponse } from 'next'

const apiRoute = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { paymentId } = req.query
    try {
      return dbGetVendorFromVendorPayment(paymentId).then((data) => res.status(200).json(data))
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
  } else if (req.method === 'DELETE') {
    const { paymentId } = req.query
    try {
      return dbDeleteVendorPayment(paymentId).then((res) => res.data)
    } catch (error) {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
  }
}

export default requireScope('clerk', apiRoute)
