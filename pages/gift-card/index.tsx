import Layout from 'components/layout'
import GiftCardTable from '../../features/inventory/features/display-gift-cards/components/gift-card-table'

export default function GiftCardPage() {
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <GiftCardTable />
    </div>
  )
}

GiftCardPage.getLayout = (page) => <Layout>{page}</Layout>
