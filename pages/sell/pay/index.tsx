import Layout from 'components/layout'
import CreateCustomerSidebar from 'features/sell/create-customer/sidebar'
import { useAppStore } from 'lib/store'
import Acct from 'features/pay/payment/acct'
import Card from 'features/pay/payment/card'
import Gift from 'features/pay/payment/gift'
import Cash from 'features/pay/payment/cash'
import ReturnItemDialog from 'features/pay/return-item-dialog'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import PayScreen from 'features/pay'

export default function PayPage() {
  const { view, cart } = useAppStore()

  return (
    <>
      <PayScreen />
      {view?.acctPaymentDialog && <Acct />}
      {view?.cardPaymentDialog && <Card />}
      {view?.cashPaymentDialog && <Cash />}
      {view?.giftPaymentDialog && <Gift />}
      {view?.createCustomer && <CreateCustomerSidebar />}
      {view?.returnItemDialog && <ReturnItemDialog sale={cart} />}
    </>
  )
}

PayPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
