import {
  clerkAtom,
  loadedStocktakeIdAtom,
  loadedStocktakeTemplateIdAtom,
} from '@/lib/atoms'
import {
  getCSVData,
  getImageSrc,
  getItemDisplayName,
  getItemSku,
  getItemSkuDisplayName,
} from '@/lib/data-functions'
import Image from 'next/image'
import { saveLog } from '@/lib/db-functions'
import {
  useInventory,
  useLogs,
  useStocktakeItemsByStocktake,
  useStocktakesByTemplate,
  useStocktakeTemplates,
} from '@/lib/swr-hooks'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { CSVLink } from 'react-csv'
import ReviewListItem from './review-list-item'
import { StockObject, StocktakeItemObject } from '@/lib/types'
import SearchIcon from '@mui/icons-material/Search'
import { useEffect, useState } from 'react'

export default function ReviewItems() {
  const [stocktakeId] = useAtom(loadedStocktakeIdAtom)
  const [stocktakeTemplateId] = useAtom(loadedStocktakeTemplateIdAtom)
  const { stocktakes, mutateStocktakes } =
    useStocktakesByTemplate(stocktakeTemplateId)
  const { stocktakeItems, mutateStocktakeItems, isStocktakeItemsLoading } =
    useStocktakeItemsByStocktake(stocktakeId)

  const stocktake = stocktakes?.filter(
    (stocktake) => stocktake?.id === stocktakeId
  )?.[0]
  const { inventory } = useInventory()
  const { stocktakeTemplates } = useStocktakeTemplates()
  const [search, setSearch] = useState('')

  const [stockItemData, setStockItemData] = useState(stocktakeItems || [])
  useEffect(
    () => setStockItemData(stocktakeItems),
    [stocktakeItems, isStocktakeItemsLoading]
  )

  const updateStocktakeItem = (item) =>
    setStockItemData(
      stockItemData?.map((si) => (si?.id === item?.id ? item : si))
    )

  return (
    <div>
      <div className="font-bold text-xl">REVIEW ITEMS</div>
      <div
        className={`flex items-center ring-1 ring-gray-400 w-auto bg-gray-100 hover:bg-gray-200 py-2`}
      >
        <div className="pl-3 pr-1">
          <SearchIcon />
        </div>
        <input
          className="w-full py-1 px-2 outline-none bg-transparent"
          value={search || ''}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items..."
        />
      </div>
      <div className="h-dialog overflow-y-scroll">
        {stockItemData.map((stocktakeItem: StocktakeItemObject) => {
          const stockItem: StockObject = inventory?.filter(
            (i: StockObject) => i?.id === stocktakeItem?.stock_id
          )?.[0]
          if (
            search !== '' &&
            !getItemSkuDisplayName(stockItem)
              ?.toLowerCase?.()
              ?.includes?.(search?.toLowerCase?.())
          )
            return <div />
          return (
            <ReviewListItem
              key={stocktakeItem?.id}
              stockItem={stockItem}
              stocktakeItem={stocktakeItem}
              stocktake={stocktake}
              updateStocktakeItem={updateStocktakeItem}
            />
          )
        })}
      </div>
    </div>
  )
}
