import { useUser } from '@auth0/nextjs-auth0'
import Loading from 'components/placeholders/loading'
import { useClerk } from 'lib/api/clerk'
import { ThemeProvider } from 'lib/contexts/ThemeContext'
import { useAppStore } from 'lib/store'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { DrawerMenu } from './drawer-menu'
import { PageHeaderProvider } from './PageHeaderContext'
import { UnifiedHeader } from './unified-header'

const InfoModal = dynamic(() => import('components/modal/info-modal'))
const ConfirmModal = dynamic(() => import('components/modal/confirm-modal'))
const HelpDialog = dynamic(() => import('features/help'))
const SnackAlert = dynamic(() => import('components/alert'))

export default function Layout({ children }) {
  const { user, isLoading: isAuthLoading } = useUser()
  const { alert, view, confirmModal, infoModal } = useAppStore()
  const { isClerkLoading } = useClerk()
  const [routeLoading, setRouteLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isAuthLoading, router])

  useEffect(() => {
    router.events.on('routeChangeStart', () => setRouteLoading(true))
    router.events.on('routeChangeComplete', () => setRouteLoading(false))
    return () => {
      router.events.off('routeChangeStart', () => setRouteLoading(true))
      router.events.off('routeChangeComplete', () => setRouteLoading(false))
    }
  }, [router.events])

  if (isAuthLoading || !user) return <Loading size="full" />

  return isClerkLoading ? (
    <Loading size="full" />
  ) : (
    <>
      <Head>
        <title>R.O.S.S. P.O.S.</title>
      </Head>
      <ThemeProvider>
        <PageHeaderProvider>
          <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
            <UnifiedHeader />
            {view?.helpDialog && <HelpDialog />}
            {confirmModal?.open && <ConfirmModal />}
            {infoModal?.open && <InfoModal />}
            {alert?.open && <SnackAlert />}
            <DrawerMenu />
            <main className="flex-1 overflow-y-auto">{routeLoading ? <Loading /> : children}</main>
          </div>
        </PageHeaderProvider>
      </ThemeProvider>
    </>
  )
}