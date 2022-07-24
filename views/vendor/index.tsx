// Packages
import { useAtom } from 'jotai'

// DB
import { pageAtom, viewAtom } from 'lib/atoms'

// Components
import ChangeStockQuantityDialog from '@/features/item-inventory/components/change-stock-quantity-dialog'
import VendorTable from 'features/display-vendors/components/vendor-table'
import ChangePriceDialog from 'features/item-inventory/components/change-price-dialog'
import InventoryItemScreen from 'features/item-inventory/components/inventory-item-screen'
import VendorScreen from 'pages/vendor/[id]'

export default function VendorPage() {
  // Atoms
  const [page] = useAtom(pageAtom)
  const [view] = useAtom(viewAtom)
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== 'vendors' ? 'hidden' : ''
      }`}
    >
      {page === 'vendors' && <VendorTable />}
      <VendorScreen />
      <InventoryItemScreen page="vendors" />
      {view?.changePriceDialog && <ChangePriceDialog />}
      {view?.changeStockQuantityDialog && <ChangeStockQuantityDialog />}
    </div>
  )
}

// const handlers = useSwipeable({
//   onSwipedRight: () =>
//     showSaleScreen
//       ? setShowSaleScreen(false)
//       : showCreateCustomer?.id
//       ? setShowCreateCustomer({ id: 0 })
//       : showHold
//       ? setShowHold(false)
//       : showCart
//       ? setShowCart(false)
//       : null,
//   onSwipedLeft: () => (!showCart ? setShowCart(true) : null),
//   preventDefaultTouchmoveEvent: true,
// });
