'use client'
import { clerkAtom } from '@lib/atoms'
import { useAccount, useAccountClerks } from '@lib/database/read'
import { useAtom } from 'jotai'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'

import MainPage from './main-page'
import SplashPage from './splash-page'

export default function LandingPage() {
  // Get google auth details
  const { user } = useAuth0()
  console.log(user)
  const { account } = useAccount(user?.email)
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
