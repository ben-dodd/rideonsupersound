import { NextApiResponse } from 'next'
import { requireScope } from 'lib/api/utils'
import { NextAuthenticatedApiRequest } from '@serverless-jwt/next/dist/types'
import { dbDeleteVendorPayment, dbGetVendorFromVendorPayment } from 'lib/database/vendor'

const apiRoute = async (req: NextAuthenticatedApiRequest, res: NextApiResponse) => {
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
