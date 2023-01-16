import Modal from 'components/modal'
import BackIcon from '@mui/icons-material/ArrowLeft'
import SearchIcon from '@mui/icons-material/Search'
import { useEffect, useState } from 'react'
import { HelpObject } from 'lib/types/help'
import HelpItem from './help-item'
import HelpListItem from './help-list-item'
import { useHelps } from 'lib/api/help'
import { filterHelps } from 'lib/functions/help'
import { useAppStore } from 'lib/store'
import { useRouter } from 'next/router'
import { ViewProps } from 'lib/store/types'

export default function HelpDialog() {
  const { helps, isHelpsLoading } = useHelps()
  const { view, closeView } = useAppStore()
  const router = useRouter()
  const page = router.pathname

  // State
  const [search, setSearch] = useState('')
  const [help, setHelp] = useState(null)
  const [helpList, setHelpList] = useState([])

  useEffect(() => {
    setHelpList(filterHelps({ helps, page, view, search }))
  }, [search, page, view, helps])

  return (
    <Modal
      open={view?.helpDialog}
      closeFunction={() => {
        closeView(ViewProps.helpDialog)
        setHelp(null)
        setSearch('')
      }}
      title={'HELP'}
      loading={isHelpsLoading}
      width="max-w-4xl"
    >
      <>
        <div className="h-search py-2 px-2">
          <div
            className={`flex items-center ring-1 ring-gray-400 w-auto bg-gray-100 hover:bg-gray-200 ${
              search && 'bg-pink-200 hover:bg-pink-300'
            }`}
          >
            <div className="pl-3 pr-1">
              <SearchIcon />
            </div>
            <input
              className="w-full py-1 px-2 outline-none bg-transparent"
              value={search || ''}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH…"
            />
          </div>
        </div>
        <div className="h-dialog overflow-y-auto">
          {help && (
            <button onClick={() => setHelp(null)} className="mb-4">
              <BackIcon /> Go Back
            </button>
          )}
          {help ? (
            <HelpItem help={help} />
          ) : helpList && helpList?.length > 0 ? (
            helpList?.map((h: HelpObject) => <HelpListItem key={h?.id} help={h} setHelp={setHelp} />)
          ) : (
            'No help topics available.'
          )}
        </div>
      </>
    </Modal>
  )
}
