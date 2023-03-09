import Loading from 'components/placeholders/loading'
import { useCurrentHolds } from 'lib/api/sale'
import { useAppStore } from 'lib/store'
import HoldsListItem from './holds-list-item'
import HoldsSidebar from './sidebar'

const HoldsList = () => {
  const { currentHolds, isCurrentHoldsLoading } = useCurrentHolds()
  const { holdsPage } = useAppStore()
  console.log(currentHolds)
  return isCurrentHoldsLoading ? (
    <Loading />
  ) : (
    <div className="h-contentsm overflow-y-scroll">
      <div className="px-2">
        {currentHolds?.map((hold) => (
          <HoldsListItem key={hold?.id} hold={hold} />
        ))}
      </div>
      {holdsPage?.loadedHold && <HoldsSidebar />}
    </div>
  )
}

export default HoldsList
