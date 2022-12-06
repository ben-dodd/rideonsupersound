import MidScreenContainer from 'components/container/mid-screen'
import CreateCustomerSidebar from 'features/customer/components/sidebar'
import CreateHoldSidebar from 'features/sale/features/hold/components/create-hold-sidebar'
import OpenRegisterScreen from 'features/sale/features/register/components'
import CloseRegisterScreen from 'features/sale/features/register/components/close-register-screen'
import ReturnCashDialog from 'features/sale/features/register/components/return-cash'
import TakeCashDialog from 'features/sale/features/register/components/take-cash'
import InventoryScroll from 'features/sale/features/sell/components/inventory-scroll'
import GiftCardDialog from 'features/sale/features/sell/components/inventory-scroll/gift-card-dialog'
import MiscItemDialog from 'features/sale/features/sell/components/inventory-scroll/misc-item-dialog'
import SellSearchBar from 'features/sale/features/sell/components/sell-search-bar'
import ShoppingCart from 'features/sale/features/sell/components/shopping-cart'
import { useRegisterID } from 'lib/database/read'
import { useSwipeable } from 'react-swipeable'
import { ViewProps } from 'lib/store/types'
import { useState } from 'react'
import { useAppStore } from 'lib/store'

export default function SellPage() {
  const { registerID } = useRegisterID()
  const { view, openView, closeView, bypassRegister } = useAppStore()
  const [search, setSearch] = useState('')

  const handlers = useSwipeable({
    onSwipedRight: () =>
      view?.saleScreen
        ? closeView(ViewProps.saleScreen)
        : view?.createCustomer
        ? closeView(ViewProps.createCustomer)
        : view?.createHold
        ? closeView(ViewProps.createHold)
        : view?.cart
        ? closeView(ViewProps.cart)
        : null,
    onSwipedLeft: () => (!view?.cart ? openView(ViewProps.cart) : null),
    preventDefaultTouchmoveEvent: true,
  })

  return registerID === 0 && !bypassRegister ? (
    <OpenRegisterScreen />
  ) : (
    <div className={`flex relative overflow-x-hidden`} {...handlers}>
      <MidScreenContainer
        title={null}
        titleClass={''}
        isLoading={false}
        actionButtons={undefined}
      >
        <SellSearchBar search={search} setSearch={setSearch} />
        <InventoryScroll search={search} />
      </MidScreenContainer>
      <ShoppingCart />
      <CreateHoldSidebar />
      <CreateCustomerSidebar />
      {view?.miscItemDialog && <MiscItemDialog />}
      {view?.giftCardDialog && <GiftCardDialog />}
      {view?.closeRegisterScreen && <CloseRegisterScreen />}
      {view?.returnCashDialog && <ReturnCashDialog />}
      {view?.takeCashDialog && <TakeCashDialog />}
    </div>
  )
}
