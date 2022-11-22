import Head from 'next/head'

import SignOutButton from 'features/sign-in/components/sign-out-button'
import { ClerkObject } from 'lib/types'
import ClerkListItem from './clerk-list-item'

export default function SplashPage({ clerks }) {
  return (
    <>
      <Head>
        <title>CHOOSE YOUR FIGHTER - R.O.S.S.</title>
      </Head>
      <div className="bg-black h-screen">
        <div className="flex flex-col sm:h-full mx-auto">
          <div className="p-8 text-center text-xl font-bold text-white">
            CHOOSE YOUR FIGHTER
          </div>
          <div>
            {clerks?.map((clerk: ClerkObject, i) => (
              <ClerkListItem key={i} clerk={clerk} />
            ))}
          </div>
          <SignOutButton />
        </div>
      </div>
    </>
  )
}
