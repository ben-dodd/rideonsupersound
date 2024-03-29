import Head from 'next/head'
import Nav from './nav'
import Menu from './menu'
import { useClerk } from 'lib/api/clerk'
import Loading from 'components/placeholders/loading'
import { useAppStore } from 'lib/store'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const InfoModal = dynamic(() => import('components/modal/info-modal'))
const ConfirmModal = dynamic(() => import('components/modal/confirm-modal'))
const HelpDialog = dynamic(() => import('features/help'))
const SnackAlert = dynamic(() => import('components/alert'))
// import Clippy from 'components/clippy'

export default function Layout({ children }) {
  const { alert, view, confirmModal, infoModal } = useAppStore()
  const { isClerkLoading } = useClerk()
  const [routeLoading, setRouteLoading] = useState(false)
  const router = useRouter()
  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setRouteLoading(true)
    })
    router.events.on('routeChangeComplete', () => {
      setRouteLoading(false)
    })
    return () => {
      router.events.off('routeChangeStart', () => {
        setRouteLoading(true)
      })
      router.events.off('routeChangeComplete', () => {
        setRouteLoading(false)
      })
    }
  }, [router.events])
  return isClerkLoading ? (
    <Loading type="pyramid" size="full" />
  ) : (
    <>
      <Head>
        <title>R.O.S.S. P.O.S.</title>
      </Head>
      <Nav />
      <div className="flex h-main relative overflow-y-hidden">
        {view?.helpDialog && <HelpDialog />}
        {confirmModal?.open && <ConfirmModal />}
        {infoModal?.open && <InfoModal />}
        {alert?.open && <SnackAlert />}
        <Menu />
        <div className="h-full w-full absolute sm:static">{routeLoading ? <Loading /> : children}</div>
      </div>
      {/* <Clippy /> */}
    </>
  )
}
