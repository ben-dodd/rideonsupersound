import { saveSystemLog } from 'features/log/lib/functions'
import NewIcon from '@mui/icons-material/AddBox'
import PayIcon from '@mui/icons-material/Payment'
import TransferIcon from '@mui/icons-material/TransferWithinAStation'
import { useClerk } from 'lib/swr/clerk'
import { useUser } from '@auth0/nextjs-auth0'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'

export default function PaymentNavActions() {
  const { user } = useUser()
  const { clerk } = useClerk(user?.sub)
  const { openView } = useAppStore()
  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Payment Nav - New Manual Payment clicked.', clerk?.id)
          openView(ViewProps.cashVendorPaymentDialog)
        }}
      >
        <NewIcon className="mr-1" />
        New Manual Payment
      </button>
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Payment Nav - New Transfer clicked.', clerk?.id)
          openView(ViewProps.transferVendorPaymentDialog)
        }}
      >
        <TransferIcon className="mr-1" />
        New Transfer
      </button>
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Payment Nav - New Batch Payment clicked.', clerk?.id)
          openView(ViewProps.batchVendorPaymentScreen)
        }}
      >
        <PayIcon className="mr-1" />
        Batch Payment
      </button>
    </div>
  )
}
