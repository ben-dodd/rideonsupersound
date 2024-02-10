import SearchInput from 'components/inputs/search-input'
import { useStockItemList, useStockList } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { useState } from 'react'
import StockFilter from './filter'
import { StockItemSearchObject } from 'lib/types/stock'
import { getItemSku } from 'lib/functions/displayInventory'
import StockListItem from './stock-list-item'
import LoadMoreButton from 'components/button/load-more-button'
import DataTable from 'components/table/data-table'

const StockList = () => {
  const { stockList, isStockListLoading } = useStockList()
  const {
    stockPage: { searchBar },
    setSearchBar,
  } = useAppStore()
  const [limit, setLimit] = useState(3)

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

  // console.log(filterSettings)

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

  console.log(stockItemList)

  const stockSchema = [
    {
      key: 'id',
      header: 'Stock ID',
      getValue: (row) => row?.item?.id,
    },
    { key: 'vendorId', header: 'Vendor ID', getValue: (row) => row?.item?.vendorId },
    { key: 'sku', header: 'SKU', getValue: (row) => getItemSku(row?.item), isLocked: true },
    {
      key: 'artist',
      header: 'Artist',
      getValue: (row) => row?.item?.artist,
    },
    {
      key: 'title',
      header: 'Title',
      getValue: (row) => row?.item?.title,
    },
  ]

  return (
    <div className="h-content overflow-y-scroll">
      <div className="px-2 flex justify-between w-full">
        <SearchInput searchValue={searchBar} handleSearch={handleSearch} />
        <StockFilter stockList={stockList} setSettings={setSetting} filterSettings={filterSettings} />
      </div>
      <div className="px-2">
        <DataTable initData={stockItemList} initSchema={stockSchema} isLoading={isStockListLoading} />
        {stockItemList?.map((stockItem) => (
          <StockListItem key={stockItem?.item?.id} stockListItem={stockItem} />
        ))}
        {limit < idList?.length && <LoadMoreButton onClick={() => setLimit((limit) => limit + 30)} />}
      </div>
    </div>
  )
}

export default StockList
