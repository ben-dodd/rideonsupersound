import MidScreenContainer from 'components/container/mid-screen'
import SearchInput from 'components/inputs/search-input'
import { useStockList } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import StockListItem from './stock-list-item'

const InventoryScreen = () => {
  const { stockList, isStockListLoading } = useStockList()
  const {
    inventoryPage: { searchBar },
    setSearchBar,
  } = useAppStore()

  const handleSearch = (e) => setSearchBar(Pages.inventoryPage, e.target.value)

  return (
    <MidScreenContainer title="INVENTORY" isLoading={isStockListLoading} titleClass="bg-col2" full={true}>
      <div className="h-content overflow-y-scroll">
        <div className="px-2">
          <SearchInput searchValue={searchBar} handleSearch={handleSearch} />
        </div>
        <div className="px-2">
          {stockList
            ?.filter?.((stockItem) => stockItem?.name?.toUpperCase?.()?.includes(searchBar?.toUpperCase()))
            ?.map((stockItem) => (
              <StockListItem key={stockItem?.id} item={stockItem} />
            ))}
        </div>
      </div>
    </MidScreenContainer>
  )
}

export default InventoryScreen
