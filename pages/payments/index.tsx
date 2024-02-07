import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import PaymentsScreen from 'features/payment'
import { useAppStore } from 'lib/store'
import dynamic from 'next/dynamic'

const CashPaymentDialog = dynamic(() => import('features/payment/cash-payment-dialog'))
const TransferVendorPaymentDialog = dynamic(() => import('features/payment/transfer-payment-dialog'))

export default function PaymentsPage() {
  const { view } = useAppStore()
  return (
    <>
      <div className={`flex relative overflow-x-hidden`}>
        <PaymentsScreen />
      </div>
      {view?.cashVendorPaymentDialog && <CashPaymentDialog />}
      {view?.transferVendorPaymentDialog && <TransferVendorPaymentDialog />}
    </>
  )
}

PaymentsPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
