import Head from 'next/head'
import Nav from './nav'
import Menu from './menu'
import HelpDialog from 'features/help/components'
import ConfirmModal from 'components/modal/confirm-modal'
import SnackAlert from 'components/alert'
import { useAtom } from 'jotai'
import { alertAtom } from 'lib/atoms'

export default function Layout({ children }) {
  const [alert] = useAtom(alertAtom)
  return (
    <>
      <Head>
        <title>R.O.S.S. P.O.S.</title>
      </Head>
      <Nav />
      <div className="flex h-menu relative overflow-y-hidden">
        <Menu />
        <div className="h-full w-full absolute sm:static">{children}</div>
        <HelpDialog />
        <ConfirmModal />
        {alert?.open && <SnackAlert />}
      </div>
    </>
  )
}
