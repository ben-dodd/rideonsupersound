import SearchInput from 'components/inputs/search-input'
import { useStockItemList, useStockList } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { useState } from 'react'
import StockFilter from './filter'
import { StockItemObject, StockItemSearchObject } from 'lib/types/stock'
import { getItemSku } from 'lib/functions/displayInventory'
import StockListItem from './stock-list-item'
import LoadMoreButton from 'components/button/load-more-button'

const StockList = () => {
  const { stockList, isStockListLoading } = useStockList()
  const {
    stockPage: { searchBar },
    setSearchBar,
  } = useAppStore()
  const [limit, setLimit] = useState(30)

  const [filterSettings, setFilterSettings] = useState({
    sortBy: [],
    artist: [],
    vendor: [],
  })

  const setSetting = (setting, e) => {
    setFilterSettings((settings) => ({
      ...settings,
      [setting]: e ? e.map((obj: any) => obj.value) : [],
    }))
  }

  console.log(filterSettings)

  const handleSearch = (e) => setSearchBar(Pages.stockPage, e.target.value)

  const idList = stockList
    ?.filter?.(
      (stockItem) =>
        (filterSettings?.artist?.length === 0 || filterSettings.artist?.includes(stockItem?.artist)) &&
        `${stockItem?.artist} ${stockItem?.title}`?.toUpperCase?.()?.includes(searchBar?.toUpperCase()),
    )
    ?.reverse()
    ?.slice(0, limit)
    ?.map((item: StockItemSearchObject) => item?.id)

  const { stockItemList = [], isStockItemListLoading = true } = useStockItemList(idList)

  const stockSchema = [
    { key: 'id', header: 'Stock ID' },
    { key: 'vendorId', header: 'Vendor ID' },
    { key: 'sku', header: 'SKU', getValue: (row: StockItemObject) => getItemSku(row), isLocked: true },
    {
      key: 'artist',
      header: 'Artist',
    },
    {
      key: 'title',
      header: 'Title',
    },
  ]

  return (
    <div className="h-content overflow-y-scroll">
      <div className="px-2 flex justify-between w-full">
        <SearchInput searchValue={searchBar} handleSearch={handleSearch} />
        <StockFilter stockList={stockList} setSettings={setSetting} filterSettings={filterSettings} />
      </div>
      <div className="px-2">
        {/* <DataTable initData={filteredList} initSchema={stockSchema} isLoading={isStockListLoading} /> */}
        {stockItemList?.map((stockItem) => (
          <StockListItem key={stockItem?.item?.id} stockListItem={stockItem} />
        ))}
        {limit < idList?.length && <LoadMoreButton onClick={() => setLimit((limit) => limit + 30)} />}
      </div>
    </div>
  )
}

export default StockList
