// Packages
import { useAtom } from 'jotai'

// DB
import PaymentTable from '@features/payment/features/display-payments/components/payment-table'
import BatchPaymentScreen from '@features/payment/features/payment/components/batch-payment-screen'
import CashPaymentDialog from '@features/payment/features/payment/components/cash-payment-dialog'
import TransferVendorPaymentDialog from '@features/payment/features/payment/components/transfer-payment-dialog'
import { pageAtom, viewAtom } from '@lib/atoms'

// Components

export default function PaymentsPage() {
  // Atoms
  const [page] = useAtom(pageAtom)
  const [view] = useAtom(viewAtom)
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== 'payments' ? 'hidden' : ''
      }`}
    >
      {page === 'payments' && <PaymentTable />}
      {/* {view?.batchVendorPaymentDialog && <BatchPaymentDialog />} */}
      {view?.cashVendorPaymentDialog && <CashPaymentDialog />}
      {view?.batchVendorPaymentScreen && <BatchPaymentScreen />}
      {view?.transferVendorPaymentDialog && <TransferVendorPaymentDialog />}
    </div>
  )
}
