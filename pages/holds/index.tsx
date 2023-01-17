import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import CreateCustomerSidebar from 'features/sell/create-customer/sidebar'

export default function HoldsPage() {
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <div>HOLDS</div>
      {/* {loadedHoldId?.holds && <HoldDialog />}
      {loadedSaleId?.holds && <SaleItemScreen />} */}
      <CreateCustomerSidebar />
    </div>
  )
}

HoldsPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
