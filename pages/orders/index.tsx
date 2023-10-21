import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import OrdersScreen from 'features/orders'

export default function OrdersPage() {
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <OrdersScreen />
    </div>
  )
}

OrdersPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
