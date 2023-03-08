import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import StocktakeListScreen from 'features/stock/stocktake/stocktake-list-screen'

export default function StocktakePage() {
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <StocktakeListScreen />
    </div>
  )
}

StocktakePage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
