'use client'
import { useAccount, useRegisterID } from '@lib/database/read'
import LandingPage from '@views/main/landing-page'
import SignIn from 'pages/api/auth/signin'
import { useAuth0 } from '@auth0/auth0-react'

export default function IndexPage() {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0()
  // const { account } = useAccount(user?.email)
  useRegisterID()
  loginWithRedirect()

  return (
    <>
      {isLoading ? (
        <div className="flex h-screen w-screen">
          <div className="loading-icon" />
        </div>
      ) : isAuthenticated ? (
        <LandingPage />
      ) : (
        <SignIn />
      )}
    </>
  )
}
