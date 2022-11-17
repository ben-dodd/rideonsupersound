import SignOutButton from '@features/sign-in/components/sign-out-button'
import LandingPage from '@views/main/landing-page'
import SignIn from './api/auth/signin'
import { useUser } from '@auth0/nextjs-auth0'

export default function IndexPage() {
  const { user, error, isLoading } = useUser()
  console.log(user)
  return (
    <>
      {isLoading ? (
        <div className="flex h-screen w-screen">
          <div className="loading-icon" />
          <SignOutButton />
        </div>
      ) : user ? (
        <LandingPage />
      ) : (
        <SignIn />
      )}
    </>
  )
}
