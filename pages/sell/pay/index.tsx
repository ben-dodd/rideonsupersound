import Layout from 'components/layout'
import { useAppStore } from 'lib/store'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useSaleProperties } from 'lib/hooks/sale'
import Acct from 'features/sale/item/edit/payment/acct'
import Card from 'features/sale/item/edit/payment/card'
import Cash from 'features/sale/item/edit/payment/cash'
import Gift from 'features/sale/item/edit/payment/gift'
import SaleEditItemScreen from 'features/sale/item/edit'
import ReturnItemDialog from 'features/sale/return-item-dialog'

export default function PayPage() {
  const { view, cart } = useAppStore()
  const { totalRemaining, isLoading } = useSaleProperties(cart, true)

  return (
    <>
      <SaleEditItemScreen totalRemaining={totalRemaining} isLoading={isLoading} />
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
