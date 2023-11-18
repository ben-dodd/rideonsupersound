import { useStockList } from 'lib/api/stock'
import { StockItemSearchObject } from 'lib/types/stock'
import RestockJob from './restock-job'
import Loading from 'components/placeholders/loading'

export default function RestockTaskView() {
  const { stockList, isStockListLoading } = useStockList()
  return isStockListLoading ? (
    <Loading />
  ) : (
    stockList
      ?.filter((item: StockItemSearchObject) => item?.needsRestock)
      .map((item: StockItemSearchObject) => <RestockJob item={item} key={item?.id} />)
  )
}
