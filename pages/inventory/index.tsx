import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import InventoryList from 'features/inventory/display-inventory/inventory-list'
import InventoryTable from 'features/inventory/display-inventory/table/inventory-table'
import LabelPrintDialog from 'features/inventory/print-labels/label-print-dialog'
import ReceiveStockScreen from 'features/inventory/receive-inventory'
import ReturnStockScreen from 'features/inventory/return-inventory/return-stock-screen'
import { useAppStore } from 'lib/store'

export default function InventoryPage() {
  const { view, tableMode } = useAppStore()
  return (
    <div className={`flex relative overflow-x-hidden`}>
      {tableMode && <InventoryTable />}
      {!tableMode && <InventoryList />}
      {view?.receiveStockScreen && <ReceiveStockScreen />}
      {view?.returnStockScreen && <ReturnStockScreen />}
      {view?.labelPrintDialog && <LabelPrintDialog />}
    </div>
  )
}

InventoryPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
