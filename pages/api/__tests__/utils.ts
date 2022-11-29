import { NextAuthenticatedApiRequest } from '@serverless-jwt/next/dist/types'
import { NextApiResponse } from 'next'
import { createMocks, RequestMethod } from 'node-mocks-http'

export function mockRequestResponse(
  method: RequestMethod = 'POST',
  permissions: string
) {
  const {
    req,
    res,
  }: { req: NextAuthenticatedApiRequest; res: NextApiResponse } = createMocks({
    method,
  })
  req.headers = {
    'Content-Type': 'application/json',
  }
  req.identityContext = {
    token: '',
    claims: { permissions: permissions?.split(' ') },
  }
  return { req, res }
}
