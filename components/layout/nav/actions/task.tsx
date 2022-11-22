import { saveSystemLog } from 'features/log/lib/functions'
import { clerkAtom, viewAtom } from 'lib/atoms'
import NewIcon from '@mui/icons-material/AddBox'
import { useAtom } from 'jotai'

export default function TaskNavActions() {
  const [view, setView] = useAtom(viewAtom)
  const [clerk] = useAtom(clerkAtom)
  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => {
          saveSystemLog('Job Nav - New Job clicked.', clerk?.id)
          setView({ ...view, taskDialog: true })
        }}
      >
        <NewIcon className="mr-1" />
        New Job
      </button>
    </div>
  )
}
