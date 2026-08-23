import { auth0 } from 'lib/auth0'
import Layout from 'components/layout'
// import StocktakeListScreen from 'features/stock/stocktake/stocktake-list-screen'

export default function StocktakePage() {
  return (
    <div className={`flex relative overflow-x-hidden`}>
      {/* <StocktakeListScreen /> */}
      <div />
    </div>
  )
}

StocktakePage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = auth0.withPageAuthRequired()
