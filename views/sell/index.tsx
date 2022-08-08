// Packages
import { useAtom } from 'jotai'
import { useSwipeable } from 'react-swipeable'

// DB
import MidScreenContainer from 'components/container/mid-screen'
import CreateCustomerSidebar from 'features/customer/components/sidebar'
import ChangePriceDialog from 'features/inventory/features/item-inventory/components/change-price-dialog'
import ChangeStockQuantityDialog from 'features/inventory/features/item-inventory/components/change-stock-quantity-dialog'
import InventoryItemScreen from 'features/inventory/features/item-inventory/components/inventory-item-screen'
import CreateHoldSidebar from 'features/sale/features/hold/components/create-hold-sidebar'
import SaleScreen from 'features/sale/features/item-sale/components'
import OpenRegisterScreen from 'features/sale/features/register/components'
import CloseRegisterScreen from 'features/sale/features/register/components/close-register-screen'
import ReturnCashDialog from 'features/sale/features/register/components/return-cash'
import TakeCashDialog from 'features/sale/features/register/components/take-cash'
import InventoryScroll from 'features/sale/features/sell/components/inventory-scroll'
import GiftCardDialog from 'features/sale/features/sell/components/inventory-scroll/gift-card-dialog'
import MiscItemDialog from 'features/sale/features/sell/components/inventory-scroll/misc-item-dialog'
import SellSearchBar from 'features/sale/features/sell/components/sell-search-bar'
import ShoppingCart from 'features/sale/features/sell/components/shopping-cart'
import {
  bypassRegisterAtom,
  loadedItemIdAtom,
  pageAtom,
  viewAtom,
} from 'lib/atoms'
import { useRegisterID } from 'lib/database/read'

// Components

export default function SellPage() {
  // SWR
  const { registerID } = useRegisterID()
  const [loadedItemId] = useAtom(loadedItemIdAtom)

  // Atoms
  const [view, setView] = useAtom(viewAtom)
  const [page] = useAtom(pageAtom)
  const [bypassRegister] = useAtom(bypassRegisterAtom)

  const handlers = useSwipeable({
    onSwipedRight: () =>
      view?.saleScreen
        ? setView({ ...view, saleScreen: false })
        : view?.createCustomer
        ? setView({ ...view, createCustomer: false })
        : view?.createHold
        ? setView({ ...view, createHold: false })
        : view?.cart
        ? setView({ ...view, cart: false })
        : null,
    onSwipedLeft: () => (!view?.cart ? setView({ ...view, cart: true }) : null),
    preventDefaultTouchmoveEvent: true,
  })

  return registerID === 0 && !bypassRegister ? (
    <OpenRegisterScreen />
  ) : (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== 'sell' || (registerID < 1 && !bypassRegister) ? 'hidden' : ''
      }`}
      {...handlers}
    >
      <MidScreenContainer
        title={null}
        titleClass={''}
        isLoading={false}
        actionButtons={undefined}
      >
        <SellSearchBar />
        <InventoryScroll />
      </MidScreenContainer>
      <ShoppingCart />
      <CreateHoldSidebar />
      <CreateCustomerSidebar />
      {view?.saleScreen && <SaleScreen />}
      {view?.miscItemDialog && <MiscItemDialog />}
      {view?.giftCardDialog && <GiftCardDialog />}
      {loadedItemId && <InventoryItemScreen page="sell" />}
      {view?.changePriceDialog && <ChangePriceDialog />}
      {view?.changeStockQuantityDialog && <ChangeStockQuantityDialog />}
      {view?.closeRegisterScreen && <CloseRegisterScreen />}
      {view?.returnCashDialog && <ReturnCashDialog />}
      {view?.takeCashDialog && <TakeCashDialog />}
    </div>
  )
}
