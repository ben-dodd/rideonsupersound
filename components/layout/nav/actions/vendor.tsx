import { saveSystemLog } from 'features/log/lib/functions'
import NewIcon from '@mui/icons-material/AddBox'
import { useAtom } from 'jotai'
import { useUser } from '@auth0/nextjs-auth0'
import { useClerk } from 'lib/swr/clerk'
import { useAppStore } from 'lib/store'

export default function VendorNavActions() {
  const { user } = useUser()
  const { clerk } = useClerk(user?.sub)
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
