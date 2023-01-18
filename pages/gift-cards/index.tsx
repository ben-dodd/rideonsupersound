import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import GiftCardScreen from 'features/gift-cards'
import GiftCardSidebar from 'features/gift-cards/sidebar'

export default function GiftCardPage() {
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <GiftCardScreen />
      <GiftCardSidebar />
    </div>
  )
}

GiftCardPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
