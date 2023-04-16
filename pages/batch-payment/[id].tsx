import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import Loading from 'components/placeholders/loading'
import BatchPaymentScreen from 'features/vendor/payment/batch-payment-screen'
import { useVendorBatchPayment } from 'lib/api/vendor'
import { useRouter } from 'next/router'

export default function BatchPaymentPage() {
  const router = useRouter()
  const { id } = router.query
  const { batchPayment, isBatchPaymentLoading } = useVendorBatchPayment(`${id}`)
  return isBatchPaymentLoading && id !== 'new' ? (
    <Loading />
  ) : (
    <>
      <BatchPaymentScreen batchPayment={id === 'new' ? {} : batchPayment} />
    </>
  )
}

BatchPaymentPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
