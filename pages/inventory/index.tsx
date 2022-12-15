import { useAtom } from 'jotai'

import InventoryList from 'features/inventory/features/display-inventory/components/inventory-list'
import InventoryTable from 'features/inventory/features/display-inventory/components/table/inventory-table'
import ChangePriceDialog from 'features/inventory/features/item-stock/components/change-price-dialog'
import ChangeStockQuantityDialog from 'features/inventory/features/item-stock/components/change-stock-quantity-dialog'
import InventoryItemScreen from 'features/inventory/features/item-inventory/components/inventory-item-screen'
import LabelPrintDialog from 'features/inventory/features/print-labels/components/label-print-dialog'
import ReceiveStockScreen from 'features/inventory/features/receive-inventory/components'
import ReturnStockScreen from 'features/inventory/features/return-inventory/components/return-stock-screen'
import { pageAtom, tableModeAtom, viewAtom } from 'lib/atoms'

export default function InventoryPage() {
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
