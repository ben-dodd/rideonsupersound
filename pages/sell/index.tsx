import dynamic from 'next/dynamic'
import { useSwipeable } from 'react-swipeable'
import { ViewProps } from 'lib/store/types'
import { useAppStore } from 'lib/store'
import { useCurrentRegister } from 'lib/api/register'
import { useRouter } from 'next/router'
import Layout from 'components/layout'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
const CreateCustomerSidebar = dynamic(() => import('features/sell/create-customer/sidebar'))
const CreateHoldSidebar = dynamic(() => import('features/sell/create-hold/sidebar'))
const CloseRegisterScreen = dynamic(() => import('features/register/close-register/sidebar'))
const ReturnCashDialog = dynamic(() => import('features/register/return-cash'))
const TakeCashDialog = dynamic(() => import('features/register/take-cash'))
const InventoryScroll = dynamic(() => import('features/sell/inventory-scroll'))
const GiftCardDialog = dynamic(() => import('features/sell/inventory-scroll/gift-card-dialog'))
const MiscItemDialog = dynamic(() => import('features/sell/inventory-scroll/misc-item-dialog'))
const SellSearchBar = dynamic(() => import('features/sell/inventory-scroll/sell-search-bar'))
const ShoppingCart = dynamic(() => import('features/sell/shopping-cart'))
const CheckHoldsDialog = dynamic(() => import('features/sell/inventory-scroll/check-holds-dialog'))
// import withRoleAuthorization from 'components/auth/roleAuthorization'

export default function SellPage() {
  const { currentRegister, isCurrentRegisterLoading } = useCurrentRegister()
  const { view, openView, closeView, options } = useAppStore()
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

  if (!currentRegister && !isCurrentRegisterLoading && !options?.doBypassRegister) router.push('/register/open')

  return (
    <div className={`flex relative overflow-x-hidden`} {...handlers}>
      <div className="h-main w-full md:w-2/3 bg-gray-100">
        <SellSearchBar />
        <InventoryScroll />
      </div>
      <ShoppingCart />
      {view?.createHold && <CreateHoldSidebar />}
      {view?.createCustomer && <CreateCustomerSidebar />}
      {view?.miscItemDialog && <MiscItemDialog />}
      {view?.giftCardDialog && <GiftCardDialog />}
      {view?.closeRegisterScreen && <CloseRegisterScreen />}
      {view?.returnCashDialog && <ReturnCashDialog />}
      {view?.takeCashDialog && <TakeCashDialog />}
      {view?.checkHoldsDialog && <CheckHoldsDialog />}
    </div>
  )
}

SellPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()

// export default withRoleAuthorization(SellPage, ['Clerk'])
