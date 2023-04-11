import Layout from 'components/layout'
import { useAppStore } from 'lib/store'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import PayScreen from 'features/sale/item/edit'
import { useSaleProperties } from 'lib/hooks/sale'
import Acct from 'features/sale/item/edit/payment/acct'
import Card from 'features/sale/item/edit/payment/card'
import Cash from 'features/sale/item/edit/payment/cash'
import Gift from 'features/sale/item/edit/payment/gift'

export default function PayPage() {
  const { view, cart } = useAppStore()
  const { totalRemaining, isLoading } = useSaleProperties(cart, true)

  return (
    <>
      <PayScreen totalRemaining={totalRemaining} isLoading={isLoading} />
      {view?.acctPaymentDialog && <Acct totalRemaining={totalRemaining} />}
      {view?.cardPaymentDialog && <Card totalRemaining={totalRemaining} />}
      {view?.cashPaymentDialog && <Cash totalRemaining={totalRemaining} />}
      {view?.giftPaymentDialog && <Gift totalRemaining={totalRemaining} />}
    </>
  )
}

PayPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
