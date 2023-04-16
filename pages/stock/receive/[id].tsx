// Packages
import { useRouter } from 'next/router'
import { useAppStore } from 'lib/store'
import Loading from 'components/placeholders/loading'
import Layout from 'components/layout'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import ErrorScreen from 'components/container/error-screen'
import ReceiveStockScreen from 'features/stock/receive-stock-screen'
import { useReceiveBatch } from 'lib/api/stock'

export default function StockItemPage() {
  const router = useRouter()
  const { id } = router.query
  const { view } = useAppStore()
  const { receiveBatch, isReceiveBatchLoading, isReceiveBatchError } = useReceiveBatch(`${id}`)
  return isReceiveBatchError ? (
    <ErrorScreen message="Receive Batch Not Found" />
  ) : isReceiveBatchLoading ? (
    <Loading />
  ) : (
    <ReceiveStockScreen receiveBatch={receiveBatch} />
  )
}

StockItemPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
