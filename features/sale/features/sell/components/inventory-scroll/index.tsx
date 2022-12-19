import { StockObject } from 'lib/types'
import { useEffect, useState } from 'react'
import { filterInventory, sortInventory } from '../../lib/functions'
import ListItem from './list-item'
import Loading from 'components/loading'
import { useStockList } from 'lib/api/stock'
import { getGeolocation } from 'lib/api/external'

export default function InventoryScroll({ search }: { search: string }) {
  const maxItemsInList = 50
  const { stockList, isStockListLoading } = useStockList()
  // console.log(stockList)
  // const weather = useWeather()
  const [geolocation, setGeolocation] = useState(null)

  useEffect(() => {
    setGeolocation(getGeolocation())
  }, [])

  return (
    <div className="h-inventory overflow-y-scroll px-2">
      {isStockListLoading ? (
        <Loading />
      ) : search ? (
        <>
          {stockList
            ?.filter((item) => filterInventory(item, search))
            ?.sort(sortInventory)
            ?.slice(0, maxItemsInList)
            ?.map((item: StockObject) => (
              <ListItem item={item} key={item?.id} />
            )) || []}
        </>
      ) : (
        <div className="text-xl">Use the search bar to find an item...</div>
      )}
    </div>
  )
}
