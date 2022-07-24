// Packages
import { useAtom } from 'jotai'

// DB
import { alertAtom, pageAtom } from '@/lib/atoms'
// import { useInventory } from "@/lib/swr-hooks";

// Components
import Alert from '@mui/material/Alert'
import Slide from '@mui/material/Slide'
import Snackbar from '@mui/material/Snackbar'

import ConfirmModal from '@/components/modal/confirm-modal'
import HelpDialog from '@/features/help/components'
import Head from 'next/head'
import GiftCardPage from '../gift-card'
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

export default function MainPage() {
  // Atoms
  const [alert, setAlert] = useAtom(alertAtom)
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
        {/* ALERTS */}
        {alert?.open && (
          <Snackbar
            open={alert?.open}
            onClose={() => setAlert(null)}
            autoHideDuration={alert?.type === 'info' ? 2000 : 4000}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            TransitionComponent={Slide}
            transitionDuration={{
              enter: 50,
              exit: 200,
            }}
          >
            <Alert
              severity={alert?.type || 'info'}
              action={
                alert.undo ? (
                  <button
                    className="bg-white p-2"
                    onClick={() => {
                      alert?.undo()
                      setAlert(null)
                    }}
                  >
                    UNDO
                  </button>
                ) : null
              }
            >
              {alert?.message || ''}
            </Alert>
          </Snackbar>
        )}
      </div>
    </>
  )
}
