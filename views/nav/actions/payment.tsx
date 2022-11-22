import { clerkAtom, viewAtom } from 'lib/atoms'
import { useAtom } from 'jotai'

import { saveSystemLog } from 'features/log/lib/functions'
import NewIcon from '@mui/icons-material/AddBox'
import PayIcon from '@mui/icons-material/Payment'
import TransferIcon from '@mui/icons-material/TransferWithinAStation'

export default function PaymentNavActions() {
  const [view, setView] = useAtom(viewAtom)
  const [clerk] = useAtom(clerkAtom)
  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Payment Nav - New Manual Payment clicked.', clerk?.id)
          setView({ ...view, cashVendorPaymentDialog: true })
        }}
      >
        <NewIcon className="mr-1" />
        New Manual Payment
      </button>
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Payment Nav - New Transfer clicked.', clerk?.id)
          setView({ ...view, transferVendorPaymentDialog: true })
        }}
      >
        <TransferIcon className="mr-1" />
        New Transfer
      </button>
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Payment Nav - New Batch Payment clicked.', clerk?.id)
          setView({ ...view, batchVendorPaymentScreen: true })
        }}
      >
        <PayIcon className="mr-1" />
        Batch Payment
      </button>
    </div>
  )
}
