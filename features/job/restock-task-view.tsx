import { useStockList } from 'lib/api/stock'
import { StockItemSearchObject } from 'lib/types/stock'
import RestockJob from './restock-job'

export default function RestockTaskView() {
  const { stockList, isStockListLoading } = useStockList()
  return isStockListLoading ? (
    <div className="w-full flex h-full">
      <div className="loading-icon" />
    </div>
  ) : (
    stockList
      ?.filter((item: StockItemSearchObject) => item?.needsRestock)
      .map((item: StockItemSearchObject) => <RestockJob item={item} key={item?.id} />)
  )
}
