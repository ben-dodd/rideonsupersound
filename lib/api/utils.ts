// lib/api/utils.ts
import { auth0 } from 'lib/auth0'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

export interface AuthenticatedApiRequest extends NextApiRequest {
  user?: {
    sub: string
    [key: string]: any
  }
}

const ROLES_CLAIM = 'https://rideonsupersound.vercel.app/roles'

export const requireScope = (
  role: string,
  apiRoute: (req: AuthenticatedApiRequest, res: NextApiResponse) => void | Promise<void>
) => {
  return async (req: AuthenticatedApiRequest, res: NextApiResponse) => {
    try {
      const session = await auth0.getSession(req)
      
      if (!session) {
        return res.status(401).json({
          error: 'not_authenticated',
          error_description: 'User is not authenticated',
        })
      }
      // console.log('DEBUG session:', JSON.stringify(session, null, 2))

      const roles = session.user?.[ROLES_CLAIM] as string[] | undefined

      if (!roles?.includes(role)) {
        return res.status(403).json({
          error: 'insufficient_scope',
          error_description: `User does not have required role: ${role}`,
        })
      }

      req.user = session.user as AuthenticatedApiRequest['user']

      return apiRoute(req, res) as void
    } catch (error) {
      console.error('Auth error:', error)
      return res.status(401).json({
        error: 'not_authenticated',
        error_description: 'User is not authenticated',
      })
    }
  }
}

export const withErrorHandling = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
try {
await handler(req, res)
  } catch (error: any) {
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    })
  }
}