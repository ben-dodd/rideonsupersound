import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import Loading from 'components/loading'
import ChangePriceDialog from 'features/inventory/item-stock/change-price-dialog'
import ChangeStockQuantityDialog from 'features/inventory/item-stock/change-stock-quantity-dialog'
import VendorScreen from 'features/vendor/item-vendor'
import { useVendor } from 'lib/api/vendor'
import { useAppStore } from 'lib/store'
import { useRouter } from 'next/router'

export default function VendorPage() {
  const router = useRouter()
  const { id } = router.query
  const { view } = useAppStore()
  const { vendor, isVendorLoading } = useVendor(`${id}`)
  console.log(vendor)
  return isVendorLoading ? (
    <Loading />
  ) : (
    <>
      <VendorScreen vendor={vendor} />
      {view?.changePriceDialog && <ChangePriceDialog />}
      {view?.changeStockQuantityDialog && <ChangeStockQuantityDialog />}
    </>
  )
}

VendorPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
