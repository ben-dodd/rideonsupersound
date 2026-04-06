
import Layout from 'components/layout'
import Loading from 'components/placeholders/loading'
import CloseRegisterScreen from 'features/register/close-register'
import CloseRegisterSidebar from 'features/register/close-register/sidebar'
import { useCurrentRegister, useCurrentRegisterId } from 'lib/api/register'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

function CloseRegisterPage() {
  const router = useRouter()
  const { registerId, isRegisterIdLoading } = useCurrentRegisterId()
  const { isCurrentRegisterLoading } = useCurrentRegister()

  useEffect(() => {
    if (!isRegisterIdLoading && !registerId) {
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

export default CloseRegisterPage
