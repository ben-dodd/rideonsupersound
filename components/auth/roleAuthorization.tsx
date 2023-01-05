import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import Image from 'next/image'
import { useRouter } from 'next/router'

const withRoleAuthorization = (Success, allowedRoles) => {
  function hoc({ user }) {
    function arrContains(arr1, arr2) {
      return arr1.some((item) => arr2.includes(item))
    }
    const usersRoles = user[`${process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}/roles`]
    if (!Array.isArray(usersRoles) || !Array.isArray(allowedRoles) || !arrContains(usersRoles, allowedRoles)) {
      return <Error />
    }
    return (
      <Layout>
        <Success />
      </Layout>
    )
  }
  return withPageAuthRequired(hoc)
}

const Error = () => {
  const { user } = useUser()
  const router = useRouter()
  console.log(user)
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <Image
        alt="Ride On Super Sound Logo"
        src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/logo_400.png`}
        height={200}
        width={200}
      />
      <div className="flex">
        <button
          className="mr-1 bg-black hover:bg-gray-900 text-white mx-auto rounded px-8 py-2 mt-4 mb-8 transform"
          onClick={() => router.back()}
        >
          Go Back
        </button>
        <button
          onClick={() => router.push(`/api/auth/logout`)}
          className="ml-1 bg-black hover:bg-gray-900 text-white mx-auto rounded px-8 py-2 mt-4 mb-8 transform"
        >
          Logout
        </button>
      </div>
      {user && (
        <div className="text-center text-sm">
          {`You do not have access to this page. Please contact the system admin.`}
        </div>
      )}
    </div>
  )
}

export default withRoleAuthorization
