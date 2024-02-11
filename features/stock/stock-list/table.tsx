import Table from 'components/table'

const StockListTable = ({ stockItemList, stockSchema }) => {
  return <Table columns={stockSchema} data={stockItemList} />
}

export default StockListTable
