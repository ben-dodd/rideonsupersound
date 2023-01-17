import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import InventoryScreen from 'features/inventory'
import LabelPrintDialog from 'features/inventory/print-labels/label-print-dialog'
import ReceiveStockScreen from 'features/inventory/receive-inventory'
import ReturnStockScreen from 'features/inventory/return-inventory/return-stock-screen'
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
