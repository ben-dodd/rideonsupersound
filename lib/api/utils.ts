import { Session } from '@auth0/nextjs-auth0'
import { NextJwtVerifier } from '@serverless-jwt/next'
import { NextAuthenticatedApiRequest } from '@serverless-jwt/next/dist/types'
import { NextApiHandler } from 'next'

const verifyJwt = NextJwtVerifier({
  issuer: process.env.AUTH0_ISSUER_BASE_URL,
  audience: process.env.AUTH0_AUDIENCE,
})

export const requireScope = (scope: string, apiRoute: NextApiHandler) => {
  return verifyJwt(async (req: NextAuthenticatedApiRequest, res) => {
    const { claims } = req.identityContext
    if (!claims || !claims.permissions || (claims.permissions as string).indexOf(scope) === -1) {
      return res.status(403).json({
        error: 'access_denied',
        error_description: `Token does not contain the required '${scope}' scope`,
      })
    }
    return apiRoute(req, res) as void
  })
}

export const checkRole = (role: string, session: Session) => {
  if (session?.user?.['https://rideonsupersound.vercel.app/roles']?.includes(role)) {
    // Use is authenticated
    return { props: {} }
  } else {
    // User is not authenticated
    console.log('user is not authenticated')
    return {
      redirect: {
        permanent: false,
        destination: '/api/auth/login',
      },
      props: {},
    }
  }
}

export const withErrorHandling = (handler) => async (req, res) => {
  try {
    await handler(req, res)
  } catch (error) {
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    })
  }
}
