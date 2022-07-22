import Head from 'next/head'

import { clerkAtom } from '@/lib/atoms'
import { saveLog } from '@/lib/db-functions'
import { useLogs } from '@/lib/swr-hooks'
import { bg, bgLight, ClerkObject } from '@/lib/types'
import SignOutButton from 'features/sign-in/components/sign-out-button'
import { useAtom } from 'jotai'

export default function SplashPage({ clerks }) {
  const { logs, mutateLogs } = useLogs()
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
            {clerks?.map((c: ClerkObject) => (
              <div
                key={c?.id}
                className={`${bgLight[c?.colour || 9]} hover:${
                  bg[c?.colour || 9]
                } text-center py-4 cursor-pointer font-bold text-lg`}
                onClick={() => {
                  setClerk(c)
                  saveLog(
                    {
                      log: `${c.name} set as clerk.`,
                      clerk_id: c?.id,
                    },
                    logs,
                    mutateLogs
                  )
                }}
              >
                {c?.name?.toUpperCase()}
              </div>
            ))}
          </div>
          <SignOutButton />
        </div>
      </div>
    </>
  )
}
