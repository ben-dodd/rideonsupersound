
import Layout from 'components/layout'
import LabelPrintScreen from 'features/stock/label-print-dialog'

function StockPage() {
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <LabelPrintScreen />
    </div>
  )
}

StockPage.getLayout = (page) => <Layout>{page}</Layout>

export default StockPage
