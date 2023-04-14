import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import { useAppStore } from 'lib/store'
import RegistersScreen from 'features/register'

export default function RegistersPage() {
  const { view } = useAppStore()
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <RegistersScreen />
    </div>
  )
}

RegistersPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
