// Packages
import { useAtom } from 'jotai'

// DB
import { pageAtom, tableModeAtom, viewAtom } from '@/lib/atoms'
import InventoryList from 'features/display-inventory/components/inventory-list'
import InventoryTable from 'features/display-inventory/components/table/inventory-table'
import ChangeStockQuantityDialog from 'features/inventory/components/change-stock-quantity-dialog'
import ChangePriceDialog from 'features/item-inventory/components/change-price-dialog'
import InventoryItemScreen from 'features/item-inventory/components/inventory-item-screen'
import LabelPrintDialog from 'features/print-labels/components/label-print-dialog'
import ReceiveStockScreen from 'features/receive-inventory/components'
import ReturnStockScreen from 'features/return-inventory/components/return-stock-screen'

// Components

export default function InventoryScreen() {
  // Atoms
  const [page] = useAtom(pageAtom)
  const [view] = useAtom(viewAtom)
  const [tableMode] = useAtom(tableModeAtom)
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== 'inventory' ? 'hidden' : ''
      }`}
    >
      {page === 'inventory' && tableMode && <InventoryTable />}
      {page === 'inventory' && !tableMode && <InventoryList />}
      <InventoryItemScreen page="inventory" />
      {view?.changePriceDialog && <ChangePriceDialog />}
      {view?.changeStockQuantityDialog && <ChangeStockQuantityDialog />}
      {view?.receiveStockScreen && <ReceiveStockScreen />}
      {view?.returnStockScreen && <ReturnStockScreen />}
      {view?.labelPrintDialog && <LabelPrintDialog />}
    </div>
  )
}
