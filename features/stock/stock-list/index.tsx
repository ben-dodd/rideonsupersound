import SearchInput from 'components/inputs/search-input'
import { useStockTableData } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
// const StockListList = dynamic(() => import('./list'))
const StockListTable = dynamic(() => import('./table'))
// const StockListSheet = dynamic(() => import('./sheet'))
import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Loading from 'components/placeholders/loading'
import { obj2query } from 'lib/utils'

const StockList = () => {
  const {
    stockPage: { searchBar, filters: storedFilters },
    setSearchBar,
  } = useAppStore()
  console.log(storedFilters)
  const [filters, setFilters] = useState(storedFilters)
  const handleSearch = (e) => setSearchBar(Pages.stockPage, e.target.value)

  const queryString = useMemo(() => obj2query({ ...filters, searchBar }), [filters, searchBar])

  const { stockTableData = [], isStockTableDataLoading = true } = useStockTableData(queryString)
  console.log(stockTableData)
  // console.log(filterSe

  return (
    <div className="h-content overflow-y-scroll">
      <div className="px-2 flex justify-between w-full">
        <SearchInput searchValue={searchBar} handleSearch={handleSearch} />
        {/* <StockFilter stockList={stockList} setSettings={setSetting} filterSettings={filterSettings} /> */}
      </div>
      <div className="px-2">
        {isStockTableDataLoading ? (
          <Loading />
        ) : (
          <StockListTable data={stockTableData} filters={filters} setFilters={setFilters} />
        )}
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
