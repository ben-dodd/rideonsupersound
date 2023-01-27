import NewIcon from '@mui/icons-material/AddBox'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'

export default function TaskNavActions() {
  const { openView } = useAppStore()
  return (
    <div className="flex">
      <button className="icon-text-button" onClick={() => openView(ViewProps.taskDialog)}>
        <NewIcon className="mr-1" />
        <div className="hidden lg:inline">New Job</div>
      </button>
    </div>
  )
}
