import { filterInventory, sortInventory } from 'lib/functions/sell'
import ListItem from './list-item'
import Loading from 'components/loading'
import { useStockList } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { StockItemSearchObject } from 'lib/types/stock'

export default function InventoryScroll() {
  const maxItemsInList = 50
  const { stockList = [], isStockListLoading = true } = useStockList()
  const { sellSearchBar } = useAppStore()
  console.log(stockList)
  return (
    <div className="h-inventory overflow-y-scroll px-2">
      {isStockListLoading ? (
        <Loading />
      ) : sellSearchBar ? (
        <>
          {stockList
            ?.filter((item: StockItemSearchObject) => filterInventory(item, sellSearchBar))
            ?.sort(sortInventory)
            ?.slice(0, maxItemsInList)
            ?.map((item: StockItemSearchObject) => <ListItem searchItem={item} key={item?.id} />) || []}
        </>
      ) : (
        <div className="text-xl">Use the search bar to find an item...</div>
      )}
    </div>
  )
}
