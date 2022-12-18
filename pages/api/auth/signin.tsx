import Image from 'next/image'
import Head from 'next/head'
import { useUser } from '@auth0/nextjs-auth0'
import Link from 'next/link'

export default function SignIn() {
  const { user } = useUser()
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
        <Link
          className="mx-auto"
          href={`/api/auth/${user ? 'logout' : 'login'}`}
        >
          <button className="bg-black hover:bg-gray-900 text-white mx-auto rounded px-8 py-2 mt-4 mb-8 transform">
            {user?.email ? 'Try Again' : 'Sign In'}
          </button>
        </Link>
        {user?.email && (
          <div className="text-center text-sm">
            {`The email ${user.email} is not authenticated. Please contact the system admin.`}
          </div>
        )}
      </div>
    </>
  )
}
