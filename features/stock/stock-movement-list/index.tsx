import SearchInput from 'components/inputs/search-input'
import { useStockMovements } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { useState } from 'react'
import LoadMoreButton from 'components/button/load-more-button'
import StockMovementItem from './stock-movement-item'

const StockMovementList = () => {
  const {
    pages: {
      stockPage: {
        searchBar: { movement: searchBar },
      },
    },
    setSearchBar,
  } = useAppStore()
  const [limit, setLimit] = useState(50)
  const { stockMovements } = useStockMovements()

  const handleSearch = (e) => setSearchBar(Pages.stockPage, e.target.value, 'movement')
  const filteredList = stockMovements?.filter?.((sm) => `${sm?.id}`?.includes(searchBar?.toUpperCase()))

  return (
    <div className="h-content overflow-y-scroll">
      <div className="px-2">
        <SearchInput searchValue={searchBar} handleSearch={handleSearch} />
      </div>

      <div className="px-2">
        {filteredList?.slice(0, limit)?.map((sm) => (
          <StockMovementItem key={sm?.id} sm={sm} />
        ))}
        {limit < filteredList?.length && <LoadMoreButton onClick={() => setLimit((limit) => limit + 10)} />}
      </div>
    </div>
  )
}

export default StockMovementList
