import LoadMoreButton from 'components/button/load-more-button'
import SearchInput from 'components/inputs/search-input'
import Loading from 'components/placeholders/loading'
import { useSales } from 'lib/api/sale'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { useState } from 'react'
import SaleListItem from '../sale-list-item'

const SalesList = () => {
  const { sales, isSalesLoading } = useSales()
  const { salesListPage, setSearchBar } = useAppStore()
  const searchBar = salesListPage?.searchBar || ''
  const [limit, setLimit] = useState(50)
  const handleSearch = (e) => setSearchBar(Pages.salesListPage, e.target.value)
  const filteredList = sales?.filter?.((sale) => searchBar === '' || searchBar === `${sale?.id}`)
  return isSalesLoading ? (
    <Loading />
  ) : (
    <div className="h-contentsm overflow-y-scroll">
      <div className="px-2">
        <SearchInput searchValue={searchBar} handleSearch={handleSearch} />
      </div>
      <div className="px-2">
        {filteredList?.slice(0, limit)?.map((sale) => (
          <SaleListItem key={sale?.id} sale={sale} />
        ))}
        {limit < filteredList?.length && <LoadMoreButton onClick={() => setLimit((limit) => limit + 50)} />}
      </div>
    </div>
  )
}

export default SalesList
