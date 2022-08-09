import { clerkAtom, loadedVendorIdAtom } from '@lib/atoms'
import { useAtom } from 'jotai'

import { saveSystemLog } from '@lib/db-functions'
import NewIcon from '@mui/icons-material/AddBox'

export default function VendorNavActions() {
  const [loadedVendorId, setLoadedVendorId] = useAtom(loadedVendorIdAtom)
  const [clerk] = useAtom(clerkAtom)
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
