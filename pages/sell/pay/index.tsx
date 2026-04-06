import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import { useSaleProperties } from 'lib/hooks/sale'
import { useAppStore } from 'lib/store'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
const Acct = dynamic(() => import('features/sale/item/edit/payment/acct'))
const Card = dynamic(() => import('features/sale/item/edit/payment/card'))
const Cash = dynamic(() => import('features/sale/item/edit/payment/cash'))
const Gift = dynamic(() => import('features/sale/item/edit/payment/gift'))
const SaleEditItemScreen = dynamic(() => import('features/sale/item/edit'))
const ReturnItemDialog = dynamic(() => import('features/sale/return-item-dialog'))

function PayPage() {
  const { view, cart } = useAppStore()
  const { totalRemaining, isLoading } = useSaleProperties(cart, true)
  const router = useRouter()

  if (cart?.items?.length === 0) router.push('/sell')

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

export default withPageAuthRequired(PayPage)
