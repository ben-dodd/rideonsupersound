import Loading from 'components/placeholders/loading'
import { useParkedSales } from 'lib/api/sale'
import SaleListItem from '../sale-list-item'

const ParkedSalesList = () => {
  const { parkedSales, isParkedSalesLoading } = useParkedSales()
  console.log(parkedSales)
  return isParkedSalesLoading ? (
    <Loading />
  ) : (
    <div className="h-content overflow-y-scroll">
      {/* <div className="px-2">
        <SearchInput searchValue={searchBar} handleSearch={handleSearch} />
      </div> */}
      <div className="px-2">
        {parkedSales
          // ?.filter?.((sale) => searchBar === '' || searchBar === `${sale?.id}`)
          ?.map((sale) => (
            <SaleListItem key={sale?.id} sale={sale} />
          ))}
      </div>
    </div>
  )
}

export default ParkedSalesList
