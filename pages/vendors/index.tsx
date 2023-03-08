import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import ChangePriceDialog from 'features/stock/item-stock/change-price-dialog'
import ChangeStockQuantityDialog from 'features/stock/item-stock/change-stock-quantity-dialog'
import VendorsScreen from 'features/vendor'
import { useAppStore } from 'lib/store'

export default function VendorsPage() {
  const { view } = useAppStore()
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <VendorsScreen />
      {view?.changePriceDialog && <ChangePriceDialog />}
      {view?.changeStockQuantityDialog && <ChangeStockQuantityDialog />}
    </div>
  )
}

VendorsPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()

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
