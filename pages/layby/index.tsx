import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import LaybyTable from '../../features/sale/features/display-laybys/layby-table'

// REVIEW add filter buttons to table for laybys etc.

export default function LaybyPage() {
  // const [loadedSaleId] = useAtom(loadedSaleIdAtom)
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <LaybyTable />
      {/* {loadedSaleId[page] && <SaleItemScreen />} */}
    </div>
  )
}

LaybyPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
