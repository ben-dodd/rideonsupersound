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
import { useSaleProperties } from 'lib/hooks'
import CreateHoldSidebar from 'features/sell/create-hold/sidebar'
import CreateLaybySidebar from 'features/pay/create-layby/sidebar'

export default function PayPage() {
  const { view, cart } = useAppStore()
  const { totalRemaining, isLoading } = useSaleProperties(cart)

  return (
    <>
      <PayScreen totalRemaining={totalRemaining} isLoading={isLoading} />
      <CreateHoldSidebar />
      <CreateLaybySidebar />
      <CreateCustomerSidebar />
      {view?.acctPaymentDialog && <Acct totalRemaining={totalRemaining} />}
      {view?.cardPaymentDialog && <Card totalRemaining={totalRemaining} />}
      {view?.cashPaymentDialog && <Cash totalRemaining={totalRemaining} />}
      {view?.giftPaymentDialog && <Gift totalRemaining={totalRemaining} />}
      {view?.returnItemDialog && <ReturnItemDialog sale={cart} />}
    </>
  )
}

PayPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
