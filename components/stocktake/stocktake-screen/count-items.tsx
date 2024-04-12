// Packages
import { useState } from 'react'
import { useAtom } from 'jotai'

// DB
import {
  useInventory,
  useLogs,
  useRegisterID,
  useStocktakeItemsByStocktake,
  useStocktakesByTemplate,
} from '@/lib/swr-hooks'
import {
  viewAtom,
  clerkAtom,
  alertAtom,
  loadedStocktakeIdAtom,
  loadedStocktakeTemplateIdAtom,
} from '@/lib/atoms'
import { StockObject, StocktakeItemObject } from '@/lib/types'

// Functions
import {
  returnStock,
  saveLog,
  saveStocktakeItemToDatabase,
  updateStocktakeInDatabase,
  updateStocktakeItemInDatabase,
} from '@/lib/db-functions'
import { getItemSkuDisplayName } from '@/lib/data-functions'

// Components
import TextField from '@/components/_components/inputs/text-field'
import Select from 'react-select'

// Icons
import CountedListItem from './counted-list-item'
import ItemCard from './item-card'
import SearchIcon from '@mui/icons-material/Search'
import dayjs from 'dayjs'

export default function CountItems() {
  // SWR
  const { inventory, mutateInventory } = useInventory()
  const [stocktakeId] = useAtom(loadedStocktakeIdAtom)
  const [stocktakeTemplateId] = useAtom(loadedStocktakeTemplateIdAtom)
  const { stocktakes, mutateStocktakes } =
    useStocktakesByTemplate(stocktakeTemplateId)
  const { stocktakeItems, mutateStocktakeItems } =
    useStocktakeItemsByStocktake(stocktakeId)

  const stocktake = stocktakes?.filter(
    (stocktake) => stocktake?.id === stocktakeId
  )?.[0]
  const { logs, mutateLogs } = useLogs()
  const { registerID } = useRegisterID()
  const [inputValue, setInputValue] = useState('')
  const [scanInput, setScanInput] = useState('')

  // Atoms
  const [clerk] = useAtom(clerkAtom)
  const [view, setView] = useAtom(viewAtom)
  const [, setAlert] = useAtom(alertAtom)

  // State
  const [lastAddedItem, setLastAddedItem] = useState(null)
  const [search, setSearch] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  function closeFunction() {
    setView({ ...view, stocktakeScreen: false })
  }

  function addCountedItem(item_id) {
    setIsLoading(true)
    let countedItem: StocktakeItemObject = stocktakeItems?.filter(
      (i) => i?.stock_id === item_id
    )?.[0]
    let stockItem: StockObject = inventory?.filter(
      (i) => i?.id === item_id
    )?.[0]
    setLastAddedItem(stockItem)
    if (countedItem) {
      countedItem.quantity_counted += 1
      countedItem.quantity_difference = countedItem?.quantity_difference + 1
      countedItem.counted_by = clerk?.id
      countedItem.date_counted = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
      countedItem.review_decision = null
      updateStocktakeItemInDatabase(countedItem)
    } else {
      countedItem = {
        id: `${stocktake?.id}-${item_id}`,
        stock_id: item_id,
        stocktake_id: stocktake?.id,
        quantity_counted: 1,
        quantity_recorded: stockItem?.quantity || 0,
        quantity_difference: 1 - (stockItem?.quantity || 0),
        counted_by: clerk?.id,
        date_counted: dayjs.utc().format('YYYY-MM-DD HH:mm:ss'),
      }
      saveStocktakeItemToDatabase(countedItem)
    }
    let countData = stocktakeItems || []
    let newCountedItems = [
      countedItem,
      ...countData.filter((i) => i?.id !== countedItem?.id),
    ]
    mutateStocktakeItems(newCountedItems, false)
    const newStocktake = {
      ...stocktake,
      total_counted: newCountedItems?.reduce(
        (prev, curr) => prev + curr?.quantity_counted,
        0
      ),
      total_unique_counted: newCountedItems?.length,
    }
    updateStocktakeInDatabase(newStocktake)
    mutateStocktakes(
      stocktakes?.map((st) => (st?.id === stocktakeId ? newStocktake : st)),
      false
    )
    setIsLoading(false)
  }

  const itemOptions = inventory?.map((item: StockObject) => ({
    value: item?.id,
    label: getItemSkuDisplayName(item),
  }))

  return (
    <div className="w-full">
      <div className="flex mt-4">
        <div className="w-1/3 border-r border-black pr-4">
          <div className="font-bold text-xl">ADD ITEMS</div>
          <TextField
            disabled={isLoading}
            inputLabel="SCANNER"
            inputClass="text-4xl"
            selectOnFocus
            autoFocus
            value={scanInput}
            onChange={(e: any) => {
              if (
                itemOptions?.filter(
                  (opt) =>
                    e.target.value ===
                    `${('00000' + opt?.value || '').slice(-5)}`
                )?.length > 0
              ) {
                addCountedItem(parseInt(e.target.value))
                setScanInput('')
              } else {
                setScanInput(e.target.value)
              }
            }}
          />
          <div className={`transition-all px-1 text-xs mt-2 mb-2`}>
            OR SEARCH ITEMS
          </div>
          <Select
            disabled={isLoading}
            className="w-full text-xs"
            value={inputValue}
            options={itemOptions}
            onChange={(item: any) => addCountedItem(parseInt(item?.value))}
            onInputChange={(newValue, actionMeta, prevInputValue) => {
              setInputValue(newValue)
              if (
                actionMeta?.action === 'input-change' &&
                itemOptions?.filter(
                  (opt) =>
                    newValue === `${('00000' + opt?.value || '').slice(-5)}`
                )?.length > 0
              ) {
                addCountedItem(parseInt(newValue))
                setInputValue('')
              }
            }}
          />
          {lastAddedItem ? (
            <>
              <div className="font-bold text-xl pt-8">LAST ADDED ITEM</div>
              <ItemCard item={lastAddedItem} />
            </>
          ) : (
            <div />
          )}
        </div>
        <div className="w-2/3 px-4">
          {stocktakeItems?.length > 0 ? (
            <div className="h-dialog">
              <div className="font-bold text-xl">{`COUNTED ${
                stocktakeItems?.reduce(
                  (prev, curr) => prev + curr?.quantity_counted,
                  0
                ) || 0
              } ITEMS`}</div>
              <div
                className={`flex items-center ring-1 ring-gray-400 w-auto bg-gray-100 hover:bg-gray-200`}
              >
                <div className="pl-3 pr-1">
                  <SearchIcon />
                </div>
                <input
                  className="w-full py-1 px-2 outline-none bg-transparent"
                  value={search || ''}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search counted items..."
                />
              </div>
              <div className="h-full overflow-y-scroll">
                {stocktakeItems
                  // ?.filter(
                  //   (stocktakeItem) => stocktakeItem?.quantity_counted > 0
                  // )
                  .map((stocktakeItem: any, i: number) => {
                    const stockItem = inventory?.filter(
                      (i: StockObject) => i?.id === stocktakeItem?.stock_id
                    )[0]
                    if (
                      search !== '' &&
                      !getItemSkuDisplayName(stockItem)
                        ?.toLowerCase?.()
                        ?.includes?.(search?.toLowerCase?.())
                    )
                      return <div />
                    return (
                      <CountedListItem
                        key={`${stocktakeItem?.id}-${i}`}
                        stocktakeItem={stocktakeItem}
                        stockItem={stockItem}
                        stocktake={stocktake}
                      />
                    )
                  })}
              </div>
            </div>
          ) : (
            <div>Select items from the drop-down menu.</div>
          )}
        </div>
      </div>
    </div>
  )
}
