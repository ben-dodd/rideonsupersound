import Loading from 'components/placeholders/loading'
import { useCurrentHolds } from 'lib/api/sale'
import HoldsListItem from './holds-list-item'

const HoldsList = () => {
  const { currentHolds, isCurrentHoldsLoading } = useCurrentHolds()
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
    </div>
  )
}

export default HoldsList
