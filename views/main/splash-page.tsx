import Head from 'next/head'

import { saveLog } from '@features/log/lib/functions'
import SignOutButton from '@features/sign-in/components/sign-out-button'
import { clerkAtom } from '@lib/atoms'
import { bg, bgLight, ClerkObject } from '@lib/types'
import { useAtom } from 'jotai'

export default function SplashPage({ clerks }) {
  const [, setClerk] = useAtom(clerkAtom)

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
            {clerks?.map((clerk: ClerkObject) => (
              <div
                key={clerk?.id}
                className={`${bgLight[clerk?.colour || 9]} hover:${
                  bg[clerk?.colour || 9]
                } text-center py-4 cursor-pointer font-bold text-lg`}
                onClick={() => {
                  setClerk(clerk)
                  saveLog(`${clerk.name} set as clerk.`, clerk?.id)
                }}
              >
                {clerk?.name?.toUpperCase()}
              </div>
            ))}
          </div>
          <SignOutButton />
        </div>
      </div>
    </>
  )
}
