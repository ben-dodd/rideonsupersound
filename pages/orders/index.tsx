import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import { useAppStore } from 'lib/store'
import OrdersScreen from 'features/orders'

export default function OrdersPage() {
  const { view } = useAppStore()
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <OrdersScreen />
    </div>
  )
}

OrdersPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
