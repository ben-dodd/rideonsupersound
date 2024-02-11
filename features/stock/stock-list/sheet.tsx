import DataTable from 'components/table/data-table'

const StockListSheet = ({ stockItemList, stockSchema, isLoading }) => {
  return <DataTable initData={stockItemList} initSchema={stockSchema} isLoading={isLoading} />
}

export default StockListSheet
