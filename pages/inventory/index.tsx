import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import InventoryScreen from 'features/stock'
import LabelPrintDialog from 'features/stock/print-labels/label-print-dialog'
import ReceiveStockScreen from 'features/stock/receive-inventory'
import ReturnStockScreen from 'features/stock/return-stock-dialog'
import { useAppStore } from 'lib/store'

export default function InventoryPage() {
  const { view, tableMode } = useAppStore()
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <InventoryScreen />
      {view?.receiveStockScreen && <ReceiveStockScreen />}
      {view?.returnStockScreen && <ReturnStockScreen />}
      {view?.labelPrintDialog && <LabelPrintDialog />}
    </div>
  )
}

InventoryPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
