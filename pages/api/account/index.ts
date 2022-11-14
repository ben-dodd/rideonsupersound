import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'

export default withApiAuthRequired(function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.send('hi')
})
