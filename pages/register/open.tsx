import Layout from 'components/layout'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Loading from 'components/placeholders/loading'
import OpenRegisterScreen from 'features/register/open-register'

export default function OpenRegisterPage() {
  const isLoading = false
  return (
    <div className="flex justify-center items-center w-full h-main">
      {isLoading ? <Loading /> : <OpenRegisterScreen />}
    </div>
  )
}

OpenRegisterPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
