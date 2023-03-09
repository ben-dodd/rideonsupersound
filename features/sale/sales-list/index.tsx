import SearchInput from 'components/inputs/search-input'
import Loading from 'components/placeholders/loading'
import { useSales } from 'lib/api/sale'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import SaleListItem from '../sale-list-item'

const SalesList = () => {
  const { sales, isSalesLoading } = useSales()
  const { salesPage, setSearchBar } = useAppStore()
  const searchBar = salesPage?.searchBar || ''
  const handleSearch = (e) => setSearchBar(Pages.salesPage, e.target.value)
  console.log(sales)
  return isSalesLoading ? (
    <Loading />
  ) : (
    <div className="h-content overflow-y-scroll">
      <div className="px-2">
        <SearchInput searchValue={searchBar} handleSearch={handleSearch} />
      </div>
      <div className="px-2">
        {sales
          ?.filter?.((sale) => searchBar === '' || searchBar === `${sale?.id}`)
          ?.map((sale) => (
            <SaleListItem key={sale?.id} sale={sale} />
          ))}
      </div>
    </div>
  )
}

export default SalesList
