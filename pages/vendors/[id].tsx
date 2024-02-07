import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import Loading from 'components/placeholders/loading'
import VendorScreen from 'features/vendor/item-vendor'
import { useVendor } from 'lib/api/vendor'
import { useAppStore } from 'lib/store'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const VendorEditDialog = dynamic(() => import('features/vendor/vendor-edit-dialog'))
const ExportVendorReportDialog = dynamic(() => import('features/vendor/export-vendor-report-dialog'))

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
