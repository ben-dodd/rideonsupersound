import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import SalesScreen from 'features/sale'
import ReturnHoldToCartDialog from 'features/sale/return-hold-to-cart-dialog'
import { useAppStore } from 'lib/store'
export default function SalesPage() {
  const { salesPage } = useAppStore()
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <SalesScreen />
      {salesPage?.returnToCartDialog && <ReturnHoldToCartDialog />}
    </div>
  )
}

SalesPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
