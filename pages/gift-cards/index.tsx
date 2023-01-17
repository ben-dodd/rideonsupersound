import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'

export default function GiftCardPage() {
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <div>GIFT CARDS</div>
    </div>
  )
}

GiftCardPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
