import SearchInput from 'components/inputs/search-input'
import { useStockList } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import StockListItem from './stock-list-item'

const StockList = () => {
  const { stockList, isStockListLoading } = useStockList()
  const {
    stockPage: { searchBar },
    setSearchBar,
  } = useAppStore()

  const handleSearch = (e) => setSearchBar(Pages.stockPage, e.target.value)

  return (
    <div className="h-content overflow-y-scroll">
      <div className="px-2">
        <SearchInput searchValue={searchBar} handleSearch={handleSearch} />
      </div>
      <div className="px-2">
        {stockList
          ?.filter?.((stockItem) =>
            `${stockItem?.artist} ${stockItem?.title}`?.toUpperCase?.()?.includes(searchBar?.toUpperCase()),
          )
          ?.map((stockItem) => (
            <StockListItem key={stockItem?.id} item={stockItem} />
          ))}
      </div>
    </div>
  )
}

export default StockList
