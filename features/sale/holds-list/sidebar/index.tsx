import { CloseRounded } from '@mui/icons-material'
import SidebarContainer from 'components/container/side-bar'
import Loading from 'components/placeholders/loading'
import { useHolds } from 'lib/api/sale'
import { getItemSkuDisplayName } from 'lib/functions/displayInventory'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { useRouter } from 'next/router'
import React from 'react'

const HoldsSidebar = () => {
  const { holdsPage, setPage } = useAppStore()
  const router = useRouter()
  const { holds, isHoldsLoading } = useHolds()
  const hold = holds?.find((hold) => hold?.id === holdsPage?.loadedHold)
  console.log(hold)
  const closeSidebar = () => setPage(Pages.holdsPage, { loadedHold: 0 })
  return (
    <SidebarContainer show={Boolean(holdsPage?.loadedHold)}>
      {isHoldsLoading ? (
        <Loading />
      ) : (
        <div>
          <div className="flex justify-between items-start h-header">
            <div />
            <div className="text-4xl font-mono py-2">HOLD</div>
            <button className="mt-2" onClick={closeSidebar}>
              <CloseRounded />
            </button>
          </div>
          <div className="p-4">
            <div className="text-xl mb-2 text-green-200">{getItemSkuDisplayName(hold)}</div>
          </div>
        </div>
      )}
    </SidebarContainer>
  )
}

export default HoldsSidebar
