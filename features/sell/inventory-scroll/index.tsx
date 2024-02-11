import { filterInventory, sortInventory } from 'lib/functions/sell'
const ListItem = dynamic(() => import('./list-item'))
import Loading from 'components/placeholders/loading'
import { useStockItemList, useStockList } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { BasicStockObject, StockItemSearchObject } from 'lib/types/stock'
import dynamic from 'next/dynamic'

export default function InventoryScroll() {
  const maxItemsInList = 50
  const { stockList = [], isStockListLoading = true } = useStockList()
  const {
    sellPage: { searchBar },
  } = useAppStore()
  const idList = stockList
    ?.filter((item: StockItemSearchObject) => filterInventory(item, searchBar))
    ?.sort(sortInventory)
    ?.slice(0, maxItemsInList)
    ?.map((item: StockItemSearchObject) => item?.id)
  const { stockItemList = [], isStockItemListLoading = true } = useStockItemList(idList)
  return (
    <div className="h-content overflow-y-scroll px-2">
      {isStockListLoading ? (
        <Loading />
      ) : searchBar ? (
        idList?.length === 0 ? (
          <div className="text-xl">No items found...</div>
        ) : isStockItemListLoading ? (
          <Loading />
        ) : (
          stockItemList?.map((stockItem: BasicStockObject) => (
            <ListItem stockItem={stockItem} key={stockItem?.item?.id} />
          ))
        )
      ) : (
        <div className="text-xl">Use the search bar to find an item...</div>
      )}
    </div>
  )
}
