import { StocktakeStatuses, StocktakeTemplateObject } from 'lib/types/stock'
import dayjs from 'dayjs'

type ListItemProps = {
  stocktakeTemplate: StocktakeTemplateObject
}

export default function StocktakeTemplateListItem({ stocktakeTemplate }: ListItemProps) {
  // SWR
  const [, setLoadedStocktakeTemplateId] = useAtom(loadedStocktakeTemplateIdAtom)

  return (
    <div
      className={`flex w-full border-b border-red-100 py-1 text-sm hover:bg-gray-100 cursor-pointer`}
      onClick={() => {
        setView({ ...view, stocktakeTemplateScreen: true })
        setLoadedStocktakeTemplateId(stocktakeTemplate?.id)
      }}
    >
      <div className="flex w-full">
        <div className="w-32">
          <div className={`w-32 h-32 relative`}>
            <img
              className="object-cover absolute"
              width="100%"
              // layout="fill"
              // objectFit="cover"
              src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/${stocktakeTemplate?.image || 'default.png'}`}
              alt={stocktakeTemplate?.name || 'Stocktake'}
            />
          </div>
        </div>
        <div>
          <div className="mx-2">
            <div className="text-4xl font-bold">{stocktakeTemplate?.name || ''}</div>
            <div className="font-bold">
              {stocktakeTemplate?.status === StocktakeStatuses?.inProgress ? (
                <div>In Progress</div>
              ) : stocktakeTemplate?.status === StocktakeStatuses?.completed ? (
                <div>{`Last completed on ${dayjs(stocktakeTemplate?.last_completed).format('D MMMM YYYY')}`}</div>
              ) : (
                <div>{`No stocktake done. ${stocktakeTemplate?.total_estimated} items estimated.`}</div>
              )}
            </div>
            <div>{stocktakeTemplate?.filter_description || ''}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
