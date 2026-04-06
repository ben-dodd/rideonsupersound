import { AuthenticatedRequest } from 'lib/api/utils';
import { NextApiResponse } from 'next';
import { createMocks, RequestMethod } from 'node-mocks-http';

export function mockRequestResponse(method: RequestMethod = 'POST', permissions: string) {
  const { req, res }: { req: AuthenticatedRequest; res: NextApiResponse } = createMocks({
    method,
  })

  req.headers = {
    'Content-Type': 'application/json',
  }

  // Swap identityContext.claims for claims
  req.claims = {
    sub: '',
    permissions: permissions?.split(' '),
  }

  return { req, res }
}

describe('placeholder', () => {
  it.todo('write tests')
})