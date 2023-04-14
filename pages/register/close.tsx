import Layout from 'components/layout'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Loading from 'components/placeholders/loading'
import CloseRegisterScreen from 'features/register/close-register'
import { useCurrentRegister, useCurrentRegisterId } from 'lib/api/register'
import CloseRegisterSidebar from 'features/register/close-register/side-bar'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function CloseRegisterPage() {
  const router = useRouter()
  const { registerId, isRegisterIdLoading } = useCurrentRegisterId()
  const { isCurrentRegisterLoading } = useCurrentRegister()

  useEffect(() => {
    if (!isRegisterIdLoading && !registerId) {
      console.log('Go to sell')
      router.push('/sell')
    }
  }, [registerId, isRegisterIdLoading, router])

  return isCurrentRegisterLoading ? (
    <Loading />
  ) : (
    <>
      <CloseRegisterScreen />
      <CloseRegisterSidebar />
    </>
  )
}

CloseRegisterPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
