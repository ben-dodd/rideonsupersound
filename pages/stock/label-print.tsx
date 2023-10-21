import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import LabelPrintScreen from 'features/stock/label-print-dialog'

export default function StockPage() {
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <LabelPrintScreen />
    </div>
  )
}

StockPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
