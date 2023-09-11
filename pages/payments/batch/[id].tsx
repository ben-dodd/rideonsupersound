import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import ErrorScreen from 'components/container/error-screen'
import Layout from 'components/layout'
import Loading from 'components/placeholders/loading'
import BatchPaymentScreen from 'features/payment/batch-payment-screen'
import { useVendorBatchPayment } from 'lib/api/vendor'
import { useRouter } from 'next/router'

export default function BatchPaymentPage() {
  const router = useRouter()
  const { id } = router.query
  const { batchPayment, isBatchPaymentLoading, isBatchPaymentError } = useVendorBatchPayment(`${id}`)
  console.log(batchPayment)
  return (isBatchPaymentError || (!isBatchPaymentLoading && !batchPayment)) && id !== 'new' ? (
    <ErrorScreen message="Batch Payment Not Found" redirectUrl={'/payments'} />
  ) : isBatchPaymentLoading && id !== 'new' ? (
    <Loading />
  ) : (
    <BatchPaymentScreen />
  )
}

BatchPaymentPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
