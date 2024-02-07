import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import Loading from 'components/placeholders/loading'
import { useVendorBatchPayment } from 'lib/api/vendor'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const ErrorScreen = dynamic(() => import('components/container/error-screen'), { loading: () => <Loading /> })
const BatchPaymentScreen = dynamic(() => import('features/payment/batch-payment-screen'), {
  loading: () => <Loading />,
})

export default function BatchPaymentPage() {
  const router = useRouter()
  const { id } = router.query
  const { batchPayment, isBatchPaymentLoading, isBatchPaymentError } = useVendorBatchPayment(`${id}`)
  return (isBatchPaymentError || (!isBatchPaymentLoading && !batchPayment?.id)) && id !== 'new' ? (
    <ErrorScreen message="Batch Payment Not Found" redirectUrl={'/payments'} />
  ) : isBatchPaymentLoading && id !== 'new' ? (
    <Loading />
  ) : (
    <BatchPaymentScreen />
  )
}

BatchPaymentPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
