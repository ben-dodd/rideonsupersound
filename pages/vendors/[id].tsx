import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import Loading from 'components/loading'
import ExportVendorReportDialog from 'features/vendor/export-vendor-report-dialog'
import VendorScreen from 'features/vendor/item-vendor'
import VendorEditDialog from 'features/vendor/vendor-edit-dialog'
import { useVendor } from 'lib/api/vendor'
import { useAppStore } from 'lib/store'
import { useRouter } from 'next/router'

export default function VendorPage() {
  const router = useRouter()
  const { id } = router.query
  const { view } = useAppStore()
  const { vendor, isVendorLoading } = useVendor(`${id}`)
  return isVendorLoading ? (
    <Loading />
  ) : (
    <>
      <VendorScreen vendor={vendor} />
      {view?.vendorEditDialog && <VendorEditDialog vendor={vendor} />}
      {view?.exportVendorReportDialog && <ExportVendorReportDialog vendor={vendor} />}
    </>
  )
}

VendorPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
