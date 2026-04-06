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

export const requireScope = (scope: string, apiRoute: NextApiHandler) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const session = await auth0.getSession()

    if (!session) {
      return res.status(401).json({
        error: 'unauthorized',
        error_description: 'No session found',
      })
    }

    const permissions = session.user?.permissions as string[] | undefined

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
