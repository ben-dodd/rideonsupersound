import { filterInventory, sortInventory } from 'lib/functions/sell'
const ListItem = dynamic(() => import('./list-item'))
import Loading from 'components/placeholders/loading'
import { useStockList } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { BasicStockItemObject } from 'lib/types/stock'

export default function InventoryScroll() {
  const maxItemsInList = 50
  const { stockList = [], isStockListLoading = true } = useStockList()
  // console.log(stockList)
  const {
    sellPage: { searchBar },
  } = useAppStore()
  const filteredList = useMemo(
    () =>
      stockList
        ?.filter((item: BasicStockItemObject) => filterInventory(item, searchBar))
        ?.sort(sortInventory)
        ?.slice(0, maxItemsInList),
    [searchBar],
  )
  // console.log(filteredList)
  return (
    <div className="h-content overflow-y-scroll px-2">
      {isStockListLoading ? (
        <Loading />
      ) : searchBar ? (
        filteredList?.length === 0 ? (
          <div className="text-xl">No items found...</div>
        ) : isStockListLoading ? (
          <Loading />
        ) : (
          filteredList?.map((item: BasicStockItemObject) => <ListItem item={item} key={item?.id} />)
        )
      ) : (
        <div className="text-xl">Use the search bar to find an item...</div>
      )}
    </div>
  )
}
