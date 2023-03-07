import { useRouter } from 'next/router'
import Layout from 'components/layout'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import SaleItemScreen from 'features/sale/item'
import { useSale } from 'lib/api/sale'
import ErrorScreen from 'components/container/error-screen'
import Loading from 'components/loading'
import SaleDetailsSidebar from 'features/sale/item/sale-details-sidebar'

export default function SaleItemPage() {
  const router = useRouter()
  const { id } = router.query
  const { sale, isSaleLoading, isSaleError } = useSale(id)
  return isSaleError ? (
    <ErrorScreen message="Sale Not Found" />
  ) : isSaleLoading ? (
    <Loading />
  ) : (
    <>
      <SaleItemScreen cart={sale} />
      <SaleDetailsSidebar cart={sale} />
    </>
  )
}

SaleItemPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
