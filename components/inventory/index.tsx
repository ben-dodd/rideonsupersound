// Packages
import { useAtom } from 'jotai'

// DB
import { pageAtom, tableModeAtom, viewAtom } from '@/lib/atoms'

// Components
import ChangePriceDialog from './change-price-dialog'
import ChangeStockQuantityDialog from './change-stock-quantity-dialog'
import InventoryItemScreen from './inventory-item-screen'
import InventoryTable from './inventory-table'
import LabelPrintDialog from './label-print-dialog'
import ReceiveStockScreen from './receive-stock-screen'
import ReturnStockScreen from './return-stock-screen'

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
      {page === 'inventory' && <InventoryTable />}
      {/* {page === "inventory" && !tableMode && <InventoryList />} */}
      <InventoryItemScreen page="inventory" />
      {view?.changePriceDialog && <ChangePriceDialog />}
      {view?.changeStockQuantityDialog && <ChangeStockQuantityDialog />}
      {view?.receiveStockScreen && <ReceiveStockScreen />}
      {view?.returnStockScreen && <ReturnStockScreen />}
      {view?.labelPrintDialog && <LabelPrintDialog />}
    </div>
  )
}
