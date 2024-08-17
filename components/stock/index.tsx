import { filterInventory } from '@/lib/data-functions'
import { StockObject } from '@/lib/types'
import StockItem from './item'
import { useState } from 'react'

const Stock = ({ vendorStock }) => {
  const [stockSearch, setStockSearch] = useState('')
  return (
    <div className="w-full">
      <input
        type="text"
        className="w-full p-1 border border-gray-200 mb-8"
        onChange={(e) => setStockSearch(e.target.value)}
        placeholder="Search.."
      />
      {filterInventory({
        inventory: vendorStock?.sort((a: StockObject, b: StockObject) => {
          if (a?.quantity === b?.quantity) return 0
          if (a?.quantity < 1) return 1
          if (b?.quantity < 1) return -1
          return 0
        }),
        search: stockSearch,
        slice: 1000,
        emptyReturn: true,
      })?.map((item: StockObject) => (
        <StockItem key={item.id} item={item} />
      ))}
    </div>
  )
}

export default Stock
