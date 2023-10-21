import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import ClerksScreen from 'features/clerks'

export default function ClerksPage() {
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <ClerksScreen />
    </div>
  )
}

ClerksPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
