import { getGeolocation, useWeather } from 'lib/api'
import { sellSearchBarAtom } from 'lib/atoms'
import { useInventory } from 'lib/database/read'
import { StockObject } from 'lib/types'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { filterInventory, sortInventory } from '../../lib/functions'
import GiftCardItem from './gift-card-item'
import ListItem from './list-item'
import MiscItem from './misc-item'
import Loading from 'components/loading'
import { useStockList } from 'lib/swr/stock'

export default function InventoryScroll() {
  const maxItemsInList = 50
  const { stockList, isStockListLoading } = useStockList()
  console.log(stockList)
  // const weather = useWeather()
  const [search] = useAtom(sellSearchBarAtom)
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
          {'gift card'.includes(search) && <GiftCardItem />}
          {'misc item'.includes(search) && <MiscItem />}
          {stockList
            ?.filter((item) => filterInventory(item, search))
            ?.sort(sortInventory)
            ?.slice(0, maxItemsInList)
            ?.map((item: StockObject) => (
              <ListItem
                item={item}
                key={item?.id}
                // weather={weather}
                weather={null}
                geolocation={geolocation}
              />
            )) || []}
        </>
      ) : (
        <div className="text-xl">Use the search bar to find an item...</div>
      )}
    </div>
  )
}
