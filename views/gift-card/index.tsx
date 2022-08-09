// Packages
import { useAtom } from 'jotai'

// DB
import { pageAtom } from '@lib/atoms'

// Components
import GiftCardTable from '../../features/inventory/features/display-gift-cards/components/gift-card-table'

export default function GiftCardPage() {
  // atoms
  const [page] = useAtom(pageAtom)
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== 'giftCards' ? 'hidden' : ''
      }`}
    >
      {' '}
      {page === 'giftCards' && <GiftCardTable />}
    </div>
  )
}
