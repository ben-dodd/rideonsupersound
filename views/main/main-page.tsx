import { alertAtom, pageAtom } from 'lib/atoms'
import { useAtom } from 'jotai'

import ConfirmModal from 'components/modal/confirm-modal'
import HelpDialog from 'features/help/components'
import Head from 'next/head'
import GiftCardPage from 'views/gift-card'
import HoldsPage from '../hold'
import InventoryPage from '../inventory'
import JobsPage from '../job'
import LaybyPage from '../layby'
import LogPage from '../log'
import Menu from '../menu'
import Nav from '../nav'
import PaymentsPage from '../payment'
import SalesPage from '../sale'
import SellPage from '../sell'
import StocktakePage from '../stocktake'
import VendorPage from '../vendor'
import SnackAlert from './alert'

export default function MainPage() {
  const [alert] = useAtom(alertAtom)
  const [page] = useAtom(pageAtom)

  // Load necessary data
  // useInventory();
  // BUG fix bug where inventory doesn't load. make all pages load until all data there, e.g. in tables

  return (
    <>
      <Head>
        <title>R.O.S.S. P.O.S.</title>
      </Head>
      <Nav />
      <div className="flex h-menu relative overflow-y-hidden">
        <Menu />
        <div className="h-full w-full absolute sm:static">
          <SellPage />
          <InventoryPage />
          <VendorPage />
          <HoldsPage />
          <LaybyPage />
          <GiftCardPage />
          <SalesPage />
          {page === 'logs' && <LogPage />}
          {page === 'jobs' && <JobsPage />}
          <PaymentsPage />
          <StocktakePage />
        </div>
        <HelpDialog />
        <ConfirmModal />
        {alert?.open && <SnackAlert />}
      </div>
    </>
  )
}
