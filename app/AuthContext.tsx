'use client'

import { Auth0Provider } from '@auth0/auth0-react'
export interface AuthContextProps {
  children: React.ReactNode
}

export default function AuthContext({ children }: AuthContextProps) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_ISSUER}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
    >
      {children}
    </Auth0Provider>
  )
}
