
import Layout from 'components/layout'
import Loading from 'components/placeholders/loading'
import OpenRegisterScreen from 'features/register/open-register'
import { useCurrentRegisterId } from 'lib/api/register'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

function OpenRegisterPage() {
  const { registerId, isRegisterIdLoading } = useCurrentRegisterId()
  const router = useRouter()

  useEffect(() => {
    if (!isRegisterIdLoading && registerId) router.push('/sell')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerId, isRegisterIdLoading])
  return (
    <div className="flex justify-center items-center w-full h-main">
      {isRegisterIdLoading ? <Loading /> : <OpenRegisterScreen />}
    </div>
  )
}

OpenRegisterPage.getLayout = (page) => <Layout>{page}</Layout>

export default OpenRegisterPage

// export async function getServerSideProps(context) {
//   console.log(context)
//   console.log(withPageAuthRequired(context))
//   return withPageAuthRequired(context)
//   // return {
//   //   props: {}, // will be passed to the page component as props
//   // }
// }
