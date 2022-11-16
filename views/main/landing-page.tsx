'use client'
import { clerkAtom } from '@lib/atoms'
import { useAccount, useAccountClerks } from '@lib/database/read'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

import MainPage from './main-page'
import SplashPage from './splash-page'
import { useUser } from '@auth0/nextjs-auth0'
import { useClerk } from '@lib/swr/clerk'

export default function LandingPage() {
  // Get google auth details
  const { user, error, isLoading } = useUser()
  console.log(user)
  // const { account } = useAccount(user?.email)
  // Get clerk details
  // const { accountClerks, isAccountClerksLoading, isAccountClerksError } =
  //   useAccountClerks(account?.id)
  // const [clerk, setClerk] = useAtom(clerkAtom)
  const { clerk, isClerkLoading, isClerkError } = useClerk(user.sub)

  // useEffect(() => {
  //   // If google account only connected to one clerk, automatically set clerk
  //   if (accountClerks?.length === 1) setClerk(accountClerks[0])
  // }, [accountClerks])

  console.log(clerk)

  return (
    <div>Hey</div>
    // <>
    //   {isAccountClerksLoading ? (
    //     <div className="flex h-screen w-screen">
    //       <div className="loading-icon" />
    //     </div>
    //   ) : clerk?.id ? (
    //     <MainPage />
    //   ) : (
    //     <SplashPage clerks={accountClerks} />
    //   )}
    // </>
  )
}
