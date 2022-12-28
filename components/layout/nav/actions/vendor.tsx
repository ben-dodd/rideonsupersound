import { saveSystemLog } from 'lib/functions/log'
import NewIcon from '@mui/icons-material/AddBox'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'

export default function VendorNavActions() {
  const { clerk } = useClerk()
  const { loadedVendorId, setLoadedVendorId } = useAppStore()
  // Change to create vendor dialog
  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Vendor Nav - New Vendor clicked.', clerk?.id)
          setLoadedVendorId({ ...loadedVendorId, vendors: -1 })
        }}
      >
        <NewIcon className="mr-1" />
        New Vendor
      </button>
    </div>
  )
}
