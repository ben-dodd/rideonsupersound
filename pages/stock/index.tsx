import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import StockScreen from 'features/stock'
import { useAppStore } from 'lib/store'
import dynamic from 'next/dynamic'

const ReturnStockScreen = dynamic(() => import('features/stock/return-stock-dialog'))
const LabelPrintDialog = dynamic(() => import('features/stock/label-print-dialog'))

export default function StockPage() {
  const { view } = useAppStore()
  return (
    <>
      <div className={`flex relative overflow-x-hidden`}>
        <StockScreen />
      </div>
      {view?.returnStockScreen && <ReturnStockScreen />}
      {view?.labelPrintDialog && <LabelPrintDialog />}
    </>
  )
}

StockPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
