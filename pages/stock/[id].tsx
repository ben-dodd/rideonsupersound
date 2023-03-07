// Packages
import { useRouter } from 'next/router'
import { useAppStore } from 'lib/store'
import { useStockItem } from 'lib/api/stock'
import Loading from 'components/loading'
import Layout from 'components/layout'
import ChangePriceDialog from 'features/inventory/item-stock/change-price-dialog'
import ChangeStockQuantityDialog from 'features/inventory/item-stock/change-stock-quantity-dialog'
import StockEditDialog from 'features/inventory/item-stock/stock-edit-dialog'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import StockItemScreen from 'features/inventory/item-stock'
import ErrorScreen from 'components/container/error-screen'

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
      {view?.stockEditDialog && <StockEditDialog />}
    </>
  )
}

StockItemPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
