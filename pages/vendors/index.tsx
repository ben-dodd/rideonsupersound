import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import VendorTable from 'features/vendor'
import { useAppStore } from 'lib/store'
import dynamic from 'next/dynamic'

const VendorEditDialog = dynamic(() => import('features/vendor/vendor-edit-dialog'))

function VendorsPage() {
  const { view } = useAppStore()
  return (
    <>
      <div className={`flex relative overflow-x-hidden`}>
        <VendorTable />
      </div>
      {view?.vendorEditDialog && <VendorEditDialog vendor={{}} />}
    </>
  )
}

VendorsPage.getLayout = (page) => <Layout>{page}</Layout>

export default withPageAuthRequired(VendorsPage)

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
