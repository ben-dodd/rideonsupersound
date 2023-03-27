import SearchInput from 'components/inputs/search-input'
import { useStockList } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { useState } from 'react'
import StockListItem from './stock-list-item'

const StockList = () => {
  const { stockList, isStockListLoading } = useStockList()
  const {
    stockPage: { searchBar },
    setSearchBar,
  } = useAppStore()
  const [limit, setLimit] = useState(50)

  const handleSearch = (e) => setSearchBar(Pages.stockPage, e.target.value)
  const filteredList = stockList?.filter?.((stockItem) =>
    `${stockItem?.artist} ${stockItem?.title}`?.toUpperCase?.()?.includes(searchBar?.toUpperCase()),
  )

  return (
    <div className="h-content overflow-y-scroll">
      <div className="px-2">
        <SearchInput searchValue={searchBar} handleSearch={handleSearch} />
      </div>
      <div className="px-2">
        {filteredList?.slice(0, limit)?.map((stockItem) => (
          <StockListItem key={stockItem?.id} item={stockItem} />
        ))}
        {limit < filteredList?.length && (
          <button
            className="my-2 p-2 mx-auto w-full border hover:bg-gray-100"
            onClick={() => setLimit((limit) => limit + 50)}
          >
            LOAD MORE...
          </button>
        )}
      </div>
    </div>
  )
}

export default StockList
