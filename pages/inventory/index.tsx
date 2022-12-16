import Layout from 'components/layout'
import InventoryList from 'features/inventory/features/display-inventory/components/inventory-list'
import InventoryTable from 'features/inventory/features/display-inventory/components/table/inventory-table'
import LabelPrintDialog from 'features/inventory/features/print-labels/components/label-print-dialog'
import ReceiveStockScreen from 'features/inventory/features/receive-inventory/components'
import ReturnStockScreen from 'features/inventory/features/return-inventory/components/return-stock-screen'
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
