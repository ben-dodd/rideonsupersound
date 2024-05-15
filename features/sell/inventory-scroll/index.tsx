const ListItem = dynamic(() => import('./list-item'))
import Loading from 'components/placeholders/loading'
import { useStockListBySearch } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { BasicStockObject } from 'lib/types/stock'
import dynamic from 'next/dynamic'

export default function InventoryScroll() {
  // const maxItemsInList = 50
  const {
    pages: {
      sellPage: { searchBar },
    },
  } = useAppStore()
  const { stockList = [], isStockListLoading = true } = useStockListBySearch(searchBar)
  console.log(stockList)
  return (
    <div className="h-content overflow-y-scroll px-2">
      {searchBar?.trim()?.length > 0 ? (
        isStockListLoading ? (
          <Loading />
        ) : stockList?.length === 0 ? (
          <div className="text-xl">No items found...</div>
        ) : (
          stockList?.map((stockItem: BasicStockObject) => <ListItem stockItem={stockItem} key={stockItem?.item?.id} />)
        )
      ) : (
        <div className="text-xl">Use the search bar to find an item...</div>
      )}
    </div>
  )
}
