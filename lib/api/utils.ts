import { SessionData } from '@auth0/nextjs-auth0/types'
import { auth0 } from 'lib/auth0'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

export interface AuthenticatedRequest extends NextApiRequest {
  claims?: {
    sub: string
    permissions: string[]
    [key: string]: any
  }
}

const NAMESPACE = 'https://rideonsupersound.vercel.app'

export const requireScope = (scope: string, apiRoute: NextApiHandler) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const session = await auth0.getSession(req)

    if (!session) {
      return res.status(401).json({
        error: 'unauthorized',
        error_description: 'No session found',
      })
    }

    // Decode the access token to get permissions
    const accessToken = session.tokenSet?.accessToken
    const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString())
    const permissions = payload?.permissions as string[] | undefined

    // console.log('permissions from access token:', permissions)

    if (!permissions || !permissions.includes(scope)) {
      return res.status(403).json({
        error: 'access_denied',
        error_description: `Token does not contain the required '${scope}' scope`,
      })
    }

    req.claims = {
      sub: session.user.sub,
      permissions,
      ...session.user,
    }

    return apiRoute(req, res)
  }
}

export const checkRole = (role: string, session: SessionData) => {
  if (session?.user?.[`${NAMESPACE}/roles`]?.includes(role)) {
    return { props: {} }
  } else {
    console.log('user is not authenticated')
    return {
      redirect: {
        permanent: false,
        destination: '/auth/login',
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