import { StockObject } from 'lib/types'
import { useEffect, useState } from 'react'
import { filterInventory, sortInventory } from '../../lib/functions'
import ListItem from './list-item'
import Loading from 'components/loading'
import { useStockList } from 'lib/api/stock'
import { getGeolocation } from 'lib/api/external'
import { useAppStore } from 'lib/store'

export default function InventoryScroll() {
  const maxItemsInList = 50
  const { stockList, isStockListLoading } = useStockList()
  const { sellSearchBar } = useAppStore()

  return (
    <div className="h-inventory overflow-y-scroll px-2">
      {isStockListLoading ? (
        <Loading />
      ) : sellSearchBar ? (
        <>
          {stockList
            ?.filter((item) => filterInventory(item, sellSearchBar))
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
