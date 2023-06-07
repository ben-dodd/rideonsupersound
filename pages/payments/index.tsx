import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import PaymentsScreen from 'features/payment'
import CashPaymentDialog from 'features/payment/cash-payment-dialog'
import TransferVendorPaymentDialog from 'features/payment/transfer-payment-dialog'
import { useAppStore } from 'lib/store'

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
