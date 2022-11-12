'use client'

import { Auth0Provider } from '@auth0/auth0-react'
import { useEffect } from 'react'
export interface AuthContextProps {
  children: React.ReactNode
}

export default function AuthContext({ children }: AuthContextProps) {
  let redirectUri = 'http://localhost:3000'
  useEffect(() => {
    redirectUri = window.location.origin
  }, [])
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_ISSUER}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      redirectUri={redirectUri}
    >
      {children}
    </Auth0Provider>
  )
}
