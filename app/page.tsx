'use client'
import { useAccount, useRegisterID } from '@lib/database/read'
import LandingPage from '@views/main/landing-page'
import { useAuth0 } from '@auth0/auth0-react'
// import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
// import "primereact/resources/primereact.min.css"; //core css
// import "primeicons/primeicons.css"; //icons
import '../styles/index.css'

export default function IndexPage() {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0()

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
