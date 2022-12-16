import ChangePriceDialog from 'features/inventory/features/item-stock/components/change-price-dialog'
import ChangeStockQuantityDialog from 'features/inventory/features/item-stock/components/change-stock-quantity-dialog'
import VendorTable from 'features/vendor/features/display-vendors/components/vendor-table'
import VendorScreen from 'features/vendor/features/item-vendor/components'
import { useAppStore } from 'lib/store'

export default function VendorPage() {
  const { view } = useAppStore()
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <VendorTable />
      <VendorScreen />
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
