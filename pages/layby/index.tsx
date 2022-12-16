import Layout from 'components/layout'
import LaybyTable from '../../features/sale/features/display-laybys/components/layby-table'

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
