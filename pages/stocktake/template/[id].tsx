import { auth0 } from 'lib/auth0'
import Layout from 'components/layout'
// import StocktakeTemplateScreen from 'features/stock/stocktake/stocktake-template-screen'
// import { useRouter } from 'next/router'

export default function StocktakePage() {
  // const router = useRouter()
  // const id = router.query.id
  // return <StocktakeTemplateScreen />
  return <div />
}

StocktakePage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = auth0.withPageAuthRequired()
