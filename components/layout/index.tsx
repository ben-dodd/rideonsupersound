import Head from 'next/head'
import Nav from './nav'
import Menu from './menu'
import ConfirmModal from 'components/modal/confirm-modal'
import SnackAlert from 'components/alert'
import { useClerk } from 'lib/api/clerk'
import Loading from 'components/loading'
import { useAppStore } from 'lib/store'
import HelpDialog from 'features/help'

export default function Layout({ children }) {
  const { alert, view, confirmModal } = useAppStore()
  const { isClerkLoading } = useClerk()
  return isClerkLoading ? (
    <Loading type="pyramid" size="full" />
  ) : (
    <>
      <Head>
        <title>R.O.S.S. P.O.S.</title>
      </Head>
      <Nav />
      <div className="flex h-main relative overflow-y-hidden">
        <Menu />
        <div className="h-full w-full absolute sm:static">{children}</div>
        {view?.helpDialog && <HelpDialog />}
        {confirmModal?.open && <ConfirmModal />}
        {alert?.open && <SnackAlert />}
      </div>
    </>
  )
}
