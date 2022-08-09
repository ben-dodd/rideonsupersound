import { useAccount, useRegisterID } from '@lib/database/read'
import LandingPage from '@views/main/landing-page'
import { useSession } from 'next-auth/client'
import SignIn from './api/auth/signin'

export default function IndexPage() {
  const [session, sessionLoading] = useSession()
  const { account } = useAccount(session?.user?.email)
  useRegisterID()

  return (
    <>
      {sessionLoading ? (
        <div className="flex h-screen w-screen">
          <div className="loading-icon" />
        </div>
      ) : session ? (
        account?.is_authenticated ? (
          <LandingPage />
        ) : (
          <SignIn />
        )
      ) : (
        <SignIn />
      )}
    </>
  )
}
