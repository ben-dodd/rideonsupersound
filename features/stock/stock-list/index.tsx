import LoadMoreButton from 'components/button/load-more-button'
import SearchInput from 'components/inputs/search-input'
import { useStockList } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { useState } from 'react'
import StockListItem from './stock-list-item'

const StockList = () => {
  const { stockList } = useStockList()
  const {
    stockPage: { searchBar },
    setSearchBar,
  } = useAppStore()
  const [limit, setLimit] = useState(30)

  const handleSearch = (e) => setSearchBar(Pages.stockPage, e.target.value)
  const filteredList = stockList
    ?.filter?.((stockItem) =>
      `${stockItem?.artist} ${stockItem?.title}`?.toUpperCase?.()?.includes(searchBar?.toUpperCase()),
    )
    ?.reverse()

  return (
    <div className="h-content overflow-y-scroll">
      <div className="px-2">
        <SearchInput searchValue={searchBar} handleSearch={handleSearch} />
      </div>
      <div className="px-2">
        {filteredList?.slice(0, limit)?.map((stockItem) => (
          <StockListItem key={stockItem?.id} stockListItem={stockItem} />
        ))}
        {limit < filteredList?.length && <LoadMoreButton onClick={() => setLimit((limit) => limit + 30)} />}
      </div>
    </div>
  )
}

export default StockList
