import { NextJwtVerifier } from '@serverless-jwt/next'
import { NextAuthenticatedApiRequest } from '@serverless-jwt/next/dist/types'
import { NextApiHandler } from 'next'

const verifyJwt = NextJwtVerifier({
  issuer: process.env.AUTH0_ISSUER_BASE_URL,
  audience: process.env.AUTH0_AUDIENCE,
})

export const requireScope = (scope: string, apiRoute: NextApiHandler) => {
  console.log('calling require scope')
  return verifyJwt(async (req: NextAuthenticatedApiRequest, res) => {
    const { claims } = req.identityContext
    console.log(claims)
    if (
      !claims ||
      !claims.permissions ||
      (claims.permissions as string).indexOf(scope) === -1
    ) {
      return res.status(403).json({
        error: 'access_denied',
        error_description: `Token does not contain the required '${scope}' scope`,
      })
    }
    return apiRoute(req, res) as void
  })
}
