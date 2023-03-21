import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import LogsScreen from 'features/log'

export default function LogPage() {
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <LogsScreen />
    </div>
  )
}

LogPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
