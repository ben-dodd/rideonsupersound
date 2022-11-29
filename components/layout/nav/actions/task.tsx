import { saveSystemLog } from 'features/log/lib/functions'
import NewIcon from '@mui/icons-material/AddBox'
import { useAppStore } from 'lib/store'
import { useClerk } from 'lib/api/clerk'
import { ViewProps } from 'lib/store/types'

export default function TaskNavActions() {
  const { openView } = useAppStore()
  const { clerk } = useClerk()
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
