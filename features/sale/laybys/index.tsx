import Loading from 'components/placeholders/loading'
import { useLaybys } from 'lib/api/sale'
import SaleListItem from '../sale-list-item'

const LaybysList = () => {
  const { laybys, isLaybysLoading } = useLaybys()
  console.log(laybys)
  return isLaybysLoading ? (
    <Loading />
  ) : (
    <div className="h-content overflow-y-scroll">
      {/* <div className="px-2">
        <SearchInput searchValue={searchBar} handleSearch={handleSearch} />
      </div> */}
      <div className="px-2">
        {laybys
          // ?.filter?.((sale) => searchBar === '' || searchBar === `${sale?.id}`)
          ?.map((sale) => (
            <SaleListItem key={sale?.id} sale={sale} />
          ))}
      </div>
    </div>
  )
}

export default LaybysList
