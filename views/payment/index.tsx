// Packages
import { useAtom } from 'jotai'

// DB
import { pageAtom, viewAtom } from '@/lib/atoms'
import BatchPaymentScreen from 'features/payment/components/batch-payment-screen'
import CashPaymentDialog from 'features/payment/components/cash-payment-dialog'
import PaymentTable from 'features/payment/components/payment-table'
import TransferVendorPaymentDialog from 'features/payment/components/transfer-payment-dialog'

// Components

export default function PaymentsScreen() {
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
