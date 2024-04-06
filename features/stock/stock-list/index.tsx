import SearchInput from 'components/inputs/search-input'
import { useFullStockTable } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
// const StockListList = dynamic(() => import('./list'))
const StockListTable = dynamic(() => import('./table'))
// const StockListSheet = dynamic(() => import('./sheet'))
import dynamic from 'next/dynamic'

const StockList = () => {
  const {
    stockPage: { searchBar, filters: storedFilters },
    setSearchBar,
  } = useAppStore()
  console.log(storedFilters)
  // const [filters, setFilters] = useState(storedFilters)
  const handleSearch = (e) => setSearchBar(Pages.stockPage, e.target.value)
  // const { stockCount = 0 } = useStockCount()

  // console.log(stockCount)

  // const onChangeFilters = (newFilters) => {
  //   setFilters(newFilters)
  // }

  // const queryString = useMemo(() => obj2query({ ...filters, searchBar }), [filters, searchBar])
  // const dummyData = useMemo(() => new Array(filters?.pagination?.pageSize).fill({}), [filters?.pagination?.pageSize])

  const { stockTableData = [], isStockTableDataLoading = true } = useFullStockTable()
  const stockCount = stockTableData?.length
  // const { pageIndex = 0, pageSize = 50 } = filters?.pagination || {}
  // const data = useMemo(
  //   () => stockTableData?.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize),
  //   [filters?.pagination, stockTableData],
  // )

  // console.log(stockTableData)
  // console.log(filterSe

  return (
    <div className="h-content overflow-y-scroll">
      <div className="px-2 flex justify-between w-full">
        <SearchInput searchValue={searchBar} handleSearch={handleSearch} />
        {/* <StockFilter stockList={stockList} setSettings={setSetting} filterSettings={filterSettings} /> */}
      </div>
      <div className="px-2">
        {isStockTableDataLoading ? (
          <div />
        ) : (
          // <StockListTable data={dummyData} rowCount={stockCount} onChangeFilters={onChangeFilters} />
          <StockListTable data={stockTableData?.slice(0, 200)} rowCount={200} />
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
