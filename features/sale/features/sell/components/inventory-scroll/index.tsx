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

export default function InventoryScroll() {
  const maxItemsInList = 50
  const { inventory, isInventoryLoading } = useInventory()
  const weather = useWeather()
  const [search] = useAtom(sellSearchBarAtom)
  const [geolocation, setGeolocation] = useState(null)

  useEffect(() => {
    setGeolocation(getGeolocation())
  }, [])

  return (
    <div className="h-inventory overflow-y-scroll px-2">
      {isInventoryLoading ? (
        <div className="w-full flex h-full">
          <div className="loading-icon" />
        </div>
      ) : search ? (
        <>
          {'gift card'.includes(search) && <GiftCardItem />}
          {'misc item'.includes(search) && <MiscItem />}
          {inventory
            ?.filter((item) => filterInventory(item, search))
            ?.sort(sortInventory)
            ?.slice(0, maxItemsInList)
            ?.map((item: StockObject) => (
              <ListItem
                item={item}
                key={item?.id}
                weather={weather}
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
