import SearchInput from 'components/inputs/search-input'
import { useStockList } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { StockItemSearchObject } from 'lib/types/stock'
// const StockListList = dynamic(() => import('./list'))
const StockListTable = dynamic(() => import('./table'))
// const StockListSheet = dynamic(() => import('./sheet'))
import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'

const StockList = () => {
  const {
    stockPage: { searchBar, sorting },
    setSearchBar,
  } = useAppStore()

  const [filters, setFilters] = useState({ sorting })
  const { stockList, isStockListLoading } = useStockList()
  const handleSearch = (e) => setSearchBar(Pages.stockPage, e.target.value)

  // console.log(filterSettings)

  const idList = useMemo(
    () =>
      stockList
        ?.filter?.((stockItem) =>
          // (filterSettings?.artist?.length === 0 || filterSettings.artist?.includes(stockItem?.artist)) &&
          `${stockItem?.artist} ${stockItem?.title}`?.toUpperCase?.()?.includes(searchBar?.toUpperCase()),
        )
        ?.reverse()
        ?.map((item: StockItemSearchObject) => item?.id),
    [searchBar, stockList],
  )

  // console.log(stockItemList)

  return (
    <div className="h-content overflow-y-scroll">
      <div className="px-2 flex justify-between w-full">
        <SearchInput searchValue={searchBar} handleSearch={handleSearch} />
        {/* <StockFilter stockList={stockList} setSettings={setSetting} filterSettings={filterSettings} /> */}
      </div>
      {/* <TablePagination
        component="div"
        count={idList?.length}
        page={pageNum}
        onPageChange={handlePageChange}
        rowsPerPage={limit}
        onRowsPerPageChange={handleRowsPerPageChange}
      /> */}
      <div className="px-2">
        <StockListTable idList={idList} filters={filters} setFilters={setFilters} />
        {/* {viewMode === 'table' ? (
          <StockListTable idList={idList} />
        ) : viewMode === 'sheet' ? (
          <StockListSheet stockItemList={stockItemList} isLoading={isStockItemListLoading} />
        ) : (
          <StockListList stockItemList={stockItemList} />
        )
        } */}
      </div>
    </div>
  )
}

export default StockList
