import { useEffect } from 'react'
import { useAccount, useAccountClerks } from '@/lib/swr-hooks'
// import { useSession } from 'next-auth/client'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useAtom } from 'jotai'
import { clerkAtom } from '@/lib/atoms'

import MainPage from './main-page'
import SplashPage from './splash-page'

export default function LandingPage() {
  // Get google auth details
  // const [session] = useSession()
  const { user } = useUser()
  const { account } = useAccount(user?.sub)
  // Get clerk details
  const { clerks, isAccountClerksLoading } = useAccountClerks(account?.id)
  const [clerk, setClerk] = useAtom(clerkAtom)

  useEffect(() => {
    // If google account only connected to one clerk, automatically set clerk
    if (clerks && clerks.length === 1) setClerk(clerks[0])
  }, [clerks])

  console.log(user)

  console.log(account)

  return (
    <>
      {isAccountClerksLoading ? (
        <div className="flex h-screen w-screen">
          <div className="loading-icon" />
        </div>
      ) : clerk?.id ? (
        <MainPage />
      ) : (
        <SplashPage clerks={clerks} />
      )}
    </>
  )
}
