import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import StocktakeListScreen from 'features/inventory/features/stocktake/components/stocktake-list-screen'
import StocktakeTemplateScreen from 'features/inventory/features/stocktake/components/stocktake-template-screen'

export default function StocktakePage() {
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <StocktakeListScreen />
    </div>
  )
}

StocktakePage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
