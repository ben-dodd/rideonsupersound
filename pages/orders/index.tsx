
import Layout from 'components/layout'
import OrdersScreen from 'features/orders'

function OrdersPage() {
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <OrdersScreen />
    </div>
  )
}

OrdersPage.getLayout = (page) => <Layout>{page}</Layout>

export default OrdersPage
