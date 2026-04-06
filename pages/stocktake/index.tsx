import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
// import StocktakeListScreen from 'features/stock/stocktake/stocktake-list-screen'

function StocktakePage() {
  return (
    <div className={`flex relative overflow-x-hidden`}>
      {/* <StocktakeListScreen /> */}
      <div />
    </div>
  )
}

StocktakePage.getLayout = (page) => <Layout>{page}</Layout>

export default withPageAuthRequired(StocktakePage)
