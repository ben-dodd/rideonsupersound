
import Layout from 'components/layout'
import GiftCardScreen from 'features/gift-cards'
import GiftCardSidebar from 'features/gift-cards/sidebar'

function GiftCardPage() {
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <GiftCardScreen />
      <GiftCardSidebar />
    </div>
  )
}

GiftCardPage.getLayout = (page) => <Layout>{page}</Layout>

export default GiftCardPage
