import CreateCustomerSidebar from 'features/customer/sidebar'
import CreateHoldSidebar from 'features/sale/hold/create-hold-sidebar'
import CloseRegisterScreen from 'features/sale/register/close-register-screen'
import ReturnCashDialog from 'features/sale/register/return-cash'
import TakeCashDialog from 'features/sale/register/take-cash'
import InventoryScroll from 'features/sale/sell/inventory-scroll'
import GiftCardDialog from 'features/sale/sell/inventory-scroll/gift-card-dialog'
import MiscItemDialog from 'features/sale/sell/inventory-scroll/misc-item-dialog'
import SellSearchBar from 'features/sale/sell/sell-search-bar'
import ShoppingCart from 'features/sale/sell/shopping-cart'
import { useSwipeable } from 'react-swipeable'
import { ViewProps } from 'lib/store/types'
import { useAppStore } from 'lib/store'
import { useCurrentRegister } from 'lib/api/register'
import { useRouter } from 'next/router'
import Layout from 'components/layout'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

export default function SellPage() {
  const { currentRegister, isCurrentRegisterLoading } = useCurrentRegister()
  const { view, openView, closeView } = useAppStore()
  const router = useRouter()

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

  if (!currentRegister && !isCurrentRegisterLoading)
    router.push('/register/open')

  return (
    <div className={`flex relative overflow-x-hidden`} {...handlers}>
      <div className="w-full sm:w-2/3 bg-gray-100">
        <SellSearchBar />
        <InventoryScroll />
      </div>
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

SellPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
