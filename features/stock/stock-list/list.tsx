import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import StockListItem from './stock-list-item'
import LoadMoreButton from 'components/button/load-more-button'

const StockListList = ({ stockItemList }) => {
  const {
    stockPage: { searchBar, limit },
    setPage,
  } = useAppStore()

  return (
    <>
      {stockItemList?.map((stockItem) => (
        <StockListItem key={stockItem?.item?.id} stockListItem={stockItem} />
      ))}
      {limit < stockItemList?.length && (
        <LoadMoreButton onClick={() => setPage(Pages.stockPage, { limit: (limit) => limit + 30 })} />
      )}
    </>
  )
}

export default StockListList
