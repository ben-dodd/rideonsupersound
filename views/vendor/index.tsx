import ChangePriceDialog from '@features/inventory/features/item-inventory/components/change-price-dialog'
import ChangeStockQuantityDialog from '@features/inventory/features/item-inventory/components/change-stock-quantity-dialog'
import InventoryItemScreen from '@features/inventory/features/item-inventory/components/inventory-item-screen'
import VendorTable from '@features/vendor/features/display-vendors/components/vendor-table'
import VendorScreen from '@features/vendor/features/item-vendor/components'
import { pageAtom, viewAtom } from '@lib/atoms'
import { useAtom } from 'jotai'

export default function VendorPage() {
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
