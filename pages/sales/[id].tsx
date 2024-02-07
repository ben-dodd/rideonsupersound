import { useRouter } from 'next/router'
import Layout from 'components/layout'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useSale } from 'lib/api/sale'
import ErrorScreen from 'components/container/error-screen'
import Loading from 'components/placeholders/loading'
// import ReturnItemDialog from 'features/sale/return-item-dialog'
import dynamic from 'next/dynamic'

const SaleItemScreen = dynamic(() => import('features/sale/item/static'), { loading: () => <Loading /> })

export default function SaleItemPage() {
  const router = useRouter()
  const { id } = router.query
  const { sale, isSaleLoading, isSaleError } = useSale(id)
  return isSaleError ? (
    <ErrorScreen message="Sale Not Found" redirectUrl={'/sales'} />
  ) : isSaleLoading ? (
    <Loading />
  ) : sale?.sale?.isDeleted ? (
    <ErrorScreen message="This Sale Has Been Deleted" redirectUrl={'/sales'} />
  ) : (
    <>
      <SaleItemScreen saleItem={sale} />
      {/* {view?.returnItemDialog && <ReturnItemDialog sale={sale} />} */}
    </>
  )
}

SaleItemPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
