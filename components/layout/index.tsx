import Head from 'next/head'
import Nav from './nav'
import Menu from './menu'
import HelpDialog from 'features/help/components'
import ConfirmModal from 'components/modal/confirm-modal'
import SnackAlert from 'components/alert'
import { useAtom } from 'jotai'
import { alertAtom } from 'lib/atoms'
import { useUser } from '@auth0/nextjs-auth0'
import { useClerk } from 'lib/swr/clerk'
import Loading from 'components/loading'

export default function Layout({ children }) {
  const [alert] = useAtom(alertAtom)
  const { user } = useUser()
  const { isClerkLoading } = useClerk(user?.sub)
  return isClerkLoading ? (
    <Loading type="pyramid" size="full" />
  ) : (
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
