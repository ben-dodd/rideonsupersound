import { AuthenticatedApiRequest } from 'lib/api/utils'
import { NextApiResponse } from 'next'
import { createMocks, RequestMethod } from 'node-mocks-http'

export function mockRequestResponse(method: RequestMethod = 'POST', permissions: string) {
  const { req, res }: { req: AuthenticatedApiRequest; res: NextApiResponse } = createMocks({
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

describe('placeholder', () => {
  it.todo('write tests')
})
