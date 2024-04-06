import SearchInput from 'components/inputs/search-input'
import { useAllStockMovements, useStockList } from 'lib/api/stock'
import { filterInventory } from 'lib/functions/sell'
import { collateStockList } from 'lib/functions/stock'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
// const StockListList = dynamic(() => import('./list'))
const StockListTable = dynamic(() => import('./table'))
// const StockListSheet = dynamic(() => import('./sheet'))
import dynamic from 'next/dynamic'

const StockList = () => {
  const { stockList = [], isStockListLoading = true } = useStockList()
  const { stockMovements = [], isStockMovementsLoading = true } = useAllStockMovements()

  const {
    stockPage: { searchBar, filters: storedFilters },
    setSearchBar,
  } = useAppStore()
  console.log(storedFilters)
  const handleSearch = (e) => setSearchBar(Pages.stockPage, e.target.value)

  const collatedStockList = collateStockList(stockList, stockMovements)

  const filteredStockList = collatedStockList?.filter((item) => filterInventory(item, searchBar))

  return (
    <div className="h-content overflow-y-scroll">
      <div className="px-2 flex justify-between w-full">
        <SearchInput searchValue={searchBar} handleSearch={handleSearch} />
        {/* <StockFilter stockList={stockList} setSettings={setSetting} filterSettings={filterSettings} /> */}
      </div>
      <div className="px-2">
        {isStockListLoading || isStockMovementsLoading ? (
          <div />
        ) : (
          // <StockListTable data={dummyData} rowCount={stockCount} onChangeFilters={onChangeFilters} />
          <StockListTable data={filteredStockList} />
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
