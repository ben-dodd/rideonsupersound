import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import SalesScreen from 'features/sale'
export default function SalesPage() {
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <SalesScreen />
    </div>
  )
}

SalesPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
