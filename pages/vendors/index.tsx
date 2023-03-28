import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import BatchPaymentScreen from 'features/vendor/payment/batch-payment-screen'
import CashPaymentDialog from 'features/vendor/payment/cash-payment-dialog'
import TransferVendorPaymentDialog from 'features/vendor/payment/transfer-payment-dialog'
import VendorsScreen from 'features/vendor'
import { useAppStore } from 'lib/store'

export default function VendorsPage() {
  const { view } = useAppStore()
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <VendorsScreen />
      {view?.cashVendorPaymentDialog && <CashPaymentDialog />}
      {view?.batchVendorPaymentScreen && <BatchPaymentScreen />}
      {view?.transferVendorPaymentDialog && <TransferVendorPaymentDialog />}
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
