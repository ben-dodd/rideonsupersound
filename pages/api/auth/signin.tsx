import Image from 'next/image'
import Head from 'next/head'

import SignInButton from 'features/sign-in/components/sign-in-button'

export default function SignIn() {
  return (
    <>
      <Head>
        <title>SIGN IN - R.O.S.S.</title>
      </Head>
      <div className="flex flex-col h-screen justify-center">
        <div className="mx-auto mb-8">
          <Image
            alt="Ride On Super Sound Logo"
            src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/logo_400.png`}
            height={200}
            width={200}
          />
        </div>
        <SignInButton />
      </div>
    </>
  )
}
