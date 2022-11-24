import SignIn from './api/auth/signin'
import { useUser } from '@auth0/nextjs-auth0'
import { useClerk } from 'lib/swr/clerk'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function IndexPage() {
  const { user, isLoading } = useUser()
  const { clerk, isClerkLoading } = useClerk(user?.sub)
  const [loading, setLoading] = useState(true)

  // put timeout on loading to avoid going to stop it flashing the "not authenticated" screen
  useEffect(() => {
    if (isLoading || isClerkLoading) setLoading(true)
    else setTimeout(() => setLoading(false), 500)
  }, [isLoading, isClerkLoading])

  const router = useRouter()
  if (clerk?.id) router.push('sell')

  return (
    <>
      {loading ? (
        <div className="flex h-screen w-screen">
          {/* <div className="loading-icon" /> */}
          <Image
            className="m-auto inline-block"
            src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/loading.gif`}
            alt="Loading"
            width={200}
            height={200}
          />
        </div>
      ) : (
        <SignIn />
      )}
    </>
  )
}
