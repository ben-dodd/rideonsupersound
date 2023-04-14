import Layout from 'components/layout'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Loading from 'components/placeholders/loading'
import OpenRegisterScreen from 'features/register/open-register'
import { useCurrentRegisterId } from 'lib/api/register'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function OpenRegisterPage() {
  const isLoading = false
  const { currentRegisterId, isCurrentRegisterIdLoading } = useCurrentRegisterId()
  const router = useRouter()

  useEffect(() => {
    if (!isCurrentRegisterIdLoading && !currentRegisterId) router.push('/sell')
  }, [currentRegisterId, isCurrentRegisterIdLoading, router])
  return (
    <div className="flex justify-center items-center w-full h-main">
      {isLoading ? <Loading /> : <OpenRegisterScreen />}
    </div>
  )
}

OpenRegisterPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()

// export async function getServerSideProps(context) {
//   console.log(context)
//   console.log(withPageAuthRequired(context))
//   return withPageAuthRequired(context)
//   // return {
//   //   props: {}, // will be passed to the page component as props
//   // }
// }
