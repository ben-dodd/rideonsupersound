import NewIcon from '@mui/icons-material/AddBox'
import PayIcon from '@mui/icons-material/Payment'
import TransferIcon from '@mui/icons-material/TransferWithinAStation'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'

export default function PaymentNavActions() {
  const { openView } = useAppStore()
  return (
    <div className="flex">
      <button className="icon-text-button" onClick={() => openView(ViewProps.cashVendorPaymentDialog)}>
        <NewIcon className="mr-1" />
        New Manual Payment
      </button>
      <button className="icon-text-button" onClick={() => openView(ViewProps.transferVendorPaymentDialog)}>
        <TransferIcon className="mr-1" />
        New Transfer
      </button>
      <button className="icon-text-button" onClick={() => openView(ViewProps.batchVendorPaymentScreen)}>
        <PayIcon className="mr-1" />
        Batch Payment
      </button>
    </div>
  )
}
