import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import Loading from 'components/placeholders/loading'
import BatchPaymentScreen from 'features/vendor/payment/batch-payment-screen'
import { useVendorBatchPayment } from 'lib/api/vendor'
import { useAppStore } from 'lib/store'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function BatchPaymentPage() {
  const router = useRouter()
  const { batchPaymentSession, setBatchPaymentSession } = useAppStore()
  const { id } = router.query
  const { batchPayment, isBatchPaymentLoading } = useVendorBatchPayment(`${id}`)
  useEffect(() => {
    if (
      batchPaymentSession?.id !== parseInt(`${id}`) ||
      (!batchPaymentSession?.id && batchPaymentSession?.accountPayments?.length === 0)
    ) {
      // Other payment session in progress, save and close
      // createBat
    }
  }, [isBatchPaymentLoading, batchPaymentSession?.id, batchPaymentSession?.accountPayments?.length, id])
  return isBatchPaymentLoading && id !== 'new' ? (
    <Loading />
  ) : (
    <>
      <BatchPaymentScreen />
    </>
  )
}

BatchPaymentPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
