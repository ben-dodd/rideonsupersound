import { useRouter } from 'next/router'
import Layout from 'components/layout'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useSale } from 'lib/api/sale'
import ErrorScreen from 'components/container/error-screen'
import Loading from 'components/placeholders/loading'
import { useAppStore } from 'lib/store'
import { SaleStateTypes } from 'lib/types/sale'
import ReturnItemDialog from 'features/sale/sale-item/completed/return-item-dialog'
import InProgressSaleScreen from 'features/sale/sale-item/in-progress'
import CompletedSaleScreen from 'features/sale/sale-item/completed'
import Acct from 'features/sale/sale-item/in-progress/payment/acct'
import Card from 'features/sale/sale-item/in-progress/payment/card'
import Cash from 'features/sale/sale-item/in-progress/payment/cash'
import Gift from 'features/sale/sale-item/in-progress/payment/gift'

export default function SaleItemPage() {
  const router = useRouter()
  const { id } = router.query
  const { view } = useAppStore()
  const { saleObject, isSaleObjectLoading, isSaleObjectError } = useSale(id)
  const { sale = {}, props: { totalRemaining = 0 } = {} } = saleObject || {}
  console.log(saleObject)
  return isSaleObjectError ? (
    <ErrorScreen message="Sale Not Found" />
  ) : isSaleObjectLoading ? (
    <Loading />
  ) : sale?.state === SaleStateTypes.Completed ? (
    <>
      <CompletedSaleScreen saleObject={saleObject} />
      {view?.returnItemDialog && <ReturnItemDialog saleObject={saleObject} />}
    </>
  ) : (
    <>
      <InProgressSaleScreen saleObject={saleObject} />
      {view?.acctPaymentDialog && <Acct totalRemaining={totalRemaining} />}
      {view?.cardPaymentDialog && <Card totalRemaining={totalRemaining} />}
      {view?.cashPaymentDialog && <Cash totalRemaining={totalRemaining} />}
      {view?.giftPaymentDialog && <Gift totalRemaining={totalRemaining} />}
    </>
  )
}

SaleItemPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
