import { saveSystemLog } from 'features/log/lib/functions'
import NewIcon from '@mui/icons-material/AddBox'
import { useAtom } from 'jotai'
import { useAppStore } from 'lib/store'
import { useClerk } from 'lib/swr/clerk'
import { useUser } from '@auth0/nextjs-auth0'
import { ViewProps } from 'lib/store/types'

export default function TaskNavActions() {
  const { openView } = useAppStore()
  const { user } = useUser()
  const { clerk } = useClerk(user?.sub)
  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Job Nav - New Job clicked.', clerk?.id)
          openView(ViewProps.taskDialog)
        }}
      >
        <NewIcon className="mr-1" />
        New Job
      </button>
    </div>
  )
}
