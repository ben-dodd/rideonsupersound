import { useRouter } from 'next/router'
import Layout from 'components/layout'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import SaleItemScreen from 'features/sale/item/static'
import { useSale } from 'lib/api/sale'
import ErrorScreen from 'components/container/error-screen'
import Loading from 'components/placeholders/loading'
import ReturnItemDialog from 'features/sale/item/static/return-item-dialog'
import { useAppStore } from 'lib/store'

export default function SaleItemPage() {
  const router = useRouter()
  const { id } = router.query
  const { view } = useAppStore()
  const { sale, isSaleLoading, isSaleError } = useSale(id)
  return isSaleError ? (
    <ErrorScreen message="Sale Not Found" />
  ) : isSaleLoading ? (
    <Loading />
  ) : (
    <>
      <SaleItemScreen cart={sale} />
      {view?.returnItemDialog && <ReturnItemDialog sale={sale} />}
    </>
  )
}

SaleItemPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
