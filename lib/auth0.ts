import { Auth0Client } from '@auth0/nextjs-auth0/server'
import { jwtDecode } from 'jwt-decode'

const ROLES_CLAIM = 'https://rideonsupersound.vercel.app/roles'

export const auth0 = new Auth0Client({
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE,
    scope: 'openid profile email offline_access',
  },
  async beforeSessionSaved(session, idToken) {
    const decoded: any = idToken ? jwtDecode(idToken) : {}
    return {
      ...session,
      user: {
        ...session.user,
        [ROLES_CLAIM]: decoded[ROLES_CLAIM],
      },
    }
  },
})