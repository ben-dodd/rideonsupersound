import { useRouter } from 'next/router'
import Layout from 'components/layout'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useReceiveBatch } from 'lib/api/stock'
import Loading from 'components/placeholders/loading'
import dynamic from 'next/dynamic'

const ErrorScreen = dynamic(() => import('components/container/error-screen'), { loading: () => <Loading /> })
const ReceiveStockScreen = dynamic(() => import('features/stock/receive-stock-screen'), { loading: () => <Loading /> })
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
