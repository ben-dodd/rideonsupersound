// import { useSession } from 'next-auth/client'
import Image from 'next/image'
import Head from 'next/head'
import { useUser } from '@auth0/nextjs-auth0/client'

// import SignInButton from '@/components/_components/button/sign-in-button'

export default function SignIn() {
  // const [session] = useSession()
  const { user } = useUser()
  return (
    <>
      <Head>
        <title>SIGN IN - R.O.S.S.</title>
      </Head>
      <div className="flex flex-col h-screen justify-center">
        <div className="mx-auto mb-8">
          <img
            src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/logo_400.png`}
            height={200}
            width={200}
          />
        </div>
        {/* <SignInButton /> */}
        {/* {user && (
          <div className="text-xs px-8 pt-4 text-center">
            <b>{user?.sub}</b>
            <br />
            is not an authenticated email address
          </div>
        )} */}
      </div>
    </>
  )
}
