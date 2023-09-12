// Packages
import { useRouter } from 'next/router'
import Loading from 'components/placeholders/loading'
import Layout from 'components/layout'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import ErrorScreen from 'components/container/error-screen'
import ReceiveStockScreen from 'features/stock/receive-stock-screen'
import { useReceiveBatch } from 'lib/api/stock'

export default function ReceiveStockPage() {
  const router = useRouter()
  const { id } = router.query
  const { receiveBatch, isReceiveBatchLoading, isReceiveBatchError } = useReceiveBatch(`${id}`)
  return (isReceiveBatchError || (!isReceiveBatchLoading && !receiveBatch?.id)) && id !== 'new' ? (
    <ErrorScreen message="Receive Batch Not Found" />
  ) : isReceiveBatchLoading && id !== 'new' ? (
    <Loading />
  ) : (
    <ReceiveStockScreen />
  )
}

ReceiveStockPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
