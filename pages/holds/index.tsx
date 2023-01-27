import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import MidScreenContainer from 'components/container/mid-screen'
import Layout from 'components/layout'
import CreateCustomerSidebar from 'features/sell/create-customer/sidebar'

export default function HoldsPage() {
  const isLoading = false
  return (
    <MidScreenContainer title="HOLDS" isLoading={isLoading} titleClass="bg-col7" full={true}>
      <div />
      {/* {loadedHoldId?.holds && <HoldDialog />}
      {loadedSaleId?.holds && <SaleItemScreen />} */}
      <CreateCustomerSidebar />
    </MidScreenContainer>
  )
}

HoldsPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
