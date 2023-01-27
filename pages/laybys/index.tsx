import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import MidScreenContainer from 'components/container/mid-screen'
import Layout from 'components/layout'

// REVIEW add filter buttons to table for laybys etc.

export default function LaybyPage() {
  // const [loadedSaleId] = useAtom(loadedSaleIdAtom)
  const isLoading = false
  return (
    <MidScreenContainer title="LAYBYS" isLoading={isLoading} titleClass="bg-col6" full={true}>
      <div />
    </MidScreenContainer>
  )
}

LaybyPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
