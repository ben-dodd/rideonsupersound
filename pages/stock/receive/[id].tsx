import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import Loading from 'components/placeholders/loading'
import { useReceiveBatch } from 'lib/api/stock'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const ErrorScreen = dynamic(() => import('components/container/error-screen'), { loading: () => <Loading /> })
const ReceiveStockScreen = dynamic(() => import('features/stock/receive-stock-screen'), { loading: () => <Loading /> })
function ReceiveStockPage() {
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

export default withPageAuthRequired(ReceiveStockPage)
