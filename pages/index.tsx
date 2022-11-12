import { useAuth0 } from '@auth0/auth0-react'
import LandingPage from '@views/main/landing-page'
import SignIn from './api/auth/signin'

export default function IndexPage() {
  const { isLoading, isAuthenticated } = useAuth0()
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
