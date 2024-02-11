import SearchInput from 'components/inputs/search-input'
import { useStockItemList, useStockList } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import StockFilter from './filter'
import { StockItemSearchObject } from 'lib/types/stock'
const StockListList = dynamic(() => import('./list'))
const StockListTable = dynamic(() => import('./table'))
const StockListSheet = dynamic(() => import('./sheet'))
import TablePagination from '@mui/material/TablePagination'
import { useMemo } from 'react'
import dynamic from 'next/dynamic'

const StockList = () => {
  const { stockList, isStockListLoading } = useStockList()
  const {
    viewMode,
    stockPage: { searchBar, limit, pageNum, filterSettings },
    setSearchBar,
    setPageFilter,
    setPage,
  } = useAppStore()

  const setSetting = (setting, e) => {
    setPageFilter(Pages.stockPage, setting, e ? e.map((obj: any) => obj.value) : [])
  }
  const handleSearch = (e) => setSearchBar(Pages.stockPage, e.target.value)
  const handlePageChange = (e, newPage) => setPage(Pages.stockPage, { pageNum: newPage })
  const handleRowsPerPageChange = (e) => setPage(Pages.stockPage, { limit: parseInt(e.target.value), pageNum: 0 })

  // console.log(filterSettings)

  const idList = useMemo(
    () =>
      stockList
        ?.filter?.(
          (stockItem) =>
            (filterSettings?.artist?.length === 0 || filterSettings.artist?.includes(stockItem?.artist)) &&
            `${stockItem?.artist} ${stockItem?.title}`?.toUpperCase?.()?.includes(searchBar?.toUpperCase()),
        )
        ?.reverse()
        ?.map((item: StockItemSearchObject) => item?.id),
    [filterSettings.artist, searchBar, stockList],
  )

  const paginatedIdList = idList?.slice(pageNum * limit, pageNum * limit + limit)

  const { stockItemList = [], isStockItemListLoading = true } = useStockItemList(paginatedIdList)

  // console.log(stockItemList)

  return (
    <div className="h-content overflow-y-scroll">
      <div className="px-2 flex justify-between w-full">
        <SearchInput searchValue={searchBar} handleSearch={handleSearch} />
        <StockFilter stockList={stockList} setSettings={setSetting} filterSettings={filterSettings} />
      </div>
      <TablePagination
        component="div"
        count={idList?.length}
        page={pageNum}
        onPageChange={handlePageChange}
        rowsPerPage={limit}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      <div className="px-2">
        {viewMode === 'table' ? (
          <StockListTable stockItemList={stockItemList} />
        ) : viewMode === 'sheet' ? (
          <StockListSheet stockItemList={stockItemList} isLoading={isStockItemListLoading} />
        ) : (
          <StockListList stockItemList={stockItemList} />
        )}
      </div>
    </div>
  )
}

export default StockList
