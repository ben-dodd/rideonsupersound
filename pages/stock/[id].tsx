import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useAppStore } from 'lib/store'
import { useStockItem } from 'lib/api/stock'
import Loading from 'components/placeholders/loading'
import Layout from 'components/layout'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

const ErrorScreen = dynamic(() => import('components/container/error-screen'), { loading: () => <Loading /> })
const StockItemScreen = dynamic(() => import('features/stock/item-stock'), { loading: () => <Loading /> })
const StockEditDialog = dynamic(() => import('features/stock/stock-edit-dialog'))
const ChangePriceDialog = dynamic(() => import('features/stock/item-stock/change-price-dialog'))
const ChangeStockQuantityDialog = dynamic(() => import('features/stock/item-stock/change-stock-quantity-dialog'))

export default function StockItemPage() {
  const router = useRouter()
  const { id } = router.query
  const { view } = useAppStore()
  const { stockItem, isStockItemLoading, isStockItemError } = useStockItem(`${id}`)
  const { item = {}, sales = [] } = stockItem || {}

  return isStockItemError ? (
    <ErrorScreen message="Stock Item Not Found" />
  ) : isStockItemLoading ? (
    <Loading />
  ) : (
    <>
      <StockItemScreen item={item} sales={sales} />
      {view?.changePriceDialog && <ChangePriceDialog />}
      {view?.changeStockQuantityDialog && <ChangeStockQuantityDialog />}
      {view?.stockEditDialog && <StockEditDialog stockItem={stockItem} />}
    </>
  )
}

StockItemPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
