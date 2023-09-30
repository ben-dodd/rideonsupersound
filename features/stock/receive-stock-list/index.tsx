import SearchInput from 'components/inputs/search-input'
import { useReceiveBatches } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { useState } from 'react'
import LoadMoreButton from 'components/button/load-more-button'
import ReceiveBatchItem from './receive-batch-item'

const ReceiveStockList = () => {
  const { receiveBatches } = useReceiveBatches()
  const {
    stockPage: { searchBar },
    setSearchBar,
  } = useAppStore()
  const [limit, setLimit] = useState(10)
  const handleSearch = (e) => setSearchBar(Pages.stockPage, e.target.value)
  const filteredList = receiveBatches?.filter?.((receiveBatch) =>
    `${receiveBatch?.id}`?.includes(searchBar?.toUpperCase()),
  )

  console.log(receiveBatches)

  return (
    <div className="h-content overflow-y-scroll">
      <div className="px-2">
        <SearchInput searchValue={searchBar} handleSearch={handleSearch} />
      </div>

      <div className="px-2">
        {filteredList?.slice(0, limit)?.map((receiveBatch) => (
          <ReceiveBatchItem key={receiveBatch?.id} receiveBatchItem={receiveBatch} />
        ))}
        {limit < filteredList?.length && <LoadMoreButton onClick={() => setLimit((limit) => limit + 10)} />}
      </div>
    </div>
  )
}

export default ReceiveStockList
