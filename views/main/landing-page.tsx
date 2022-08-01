import { useAtom } from 'jotai'
import { clerkAtom } from 'lib/atoms'
import { useAccount, useAccountClerks } from 'lib/database/read'
import { useSession } from 'next-auth/client'
import { useEffect } from 'react'

import MainPage from './main-page'
import SplashPage from './splash-page'

export default function LandingPage() {
  // Get google auth details
  const [session] = useSession()
  const { account } = useAccount(session?.user?.email)
  // Get clerk details
  const { accountClerks, isAccountClerksLoading, isAccountClerksError } =
    useAccountClerks(account?.id)
  const [clerk, setClerk] = useAtom(clerkAtom)

  useEffect(() => {
    // If google account only connected to one clerk, automatically set clerk
    if (accountClerks?.length === 1) setClerk(accountClerks[0])
  }, [accountClerks])

  return (
    <>
      {isAccountClerksLoading ? (
        <div className="flex h-screen w-screen">
          <div className="loading-icon" />
        </div>
      ) : clerk?.id ? (
        <MainPage />
      ) : (
        <SplashPage clerks={accountClerks} />
      )}
    </>
  )
}
