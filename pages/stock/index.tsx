import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import StockScreen from 'features/stock'
import LabelPrintDialog from 'features/stock/print-labels/label-print-dialog'
import ReceiveStockScreen from 'features/stock/receive-stock-dialog'
import ReturnStockScreen from 'features/stock/return-stock-dialog'
import { useAppStore } from 'lib/store'

export default function StockPage() {
  const { view } = useAppStore()
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <StockScreen />
      {view?.receiveStockScreen && <ReceiveStockScreen />}
      {view?.returnStockScreen && <ReturnStockScreen />}
      {view?.labelPrintDialog && <LabelPrintDialog />}
    </div>
  )
}

StockPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
