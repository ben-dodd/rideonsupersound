import Layout from 'components/layout'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Loading from 'components/loading'
import CloseRegisterScreen from 'features/register/close-register'
import { useCurrentRegister } from 'lib/api/register'
import CloseRegisterSidebar from 'features/register/close-register/side-bar'

export default function CloseRegisterPage() {
  const { currentRegister, isCurrentRegisterLoading } = useCurrentRegister()
  return isCurrentRegisterLoading ? (
    <Loading />
  ) : (
    <>
      <CloseRegisterScreen />
      <CloseRegisterSidebar />
    </>
  )
}

CloseRegisterPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
