import Layout from 'components/layout'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Loading from 'components/loading'
import CloseRegisterScreen from 'features/register/close-register'

export default function CloseRegisterPage() {
  const isLoading = false
  return (
    <div className="flex items-start overflow-auto w-full h-main">
      {isLoading ? <Loading /> : <CloseRegisterScreen />}
    </div>
  )
}

CloseRegisterPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
