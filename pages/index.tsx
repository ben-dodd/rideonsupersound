
import Loading from 'components/placeholders/loading'
import { useCurrentRegisterId } from 'lib/api/register'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

function IndexPage() {
  const router = useRouter()
  const { registerId, isRegisterIdLoading } = useCurrentRegisterId()
  useEffect(() => {
    if (!isRegisterIdLoading) {
      if (registerId) router?.push('/sell')
      else router?.push('/register/open')
    }
  }, [registerId, isRegisterIdLoading, router])

  return <Loading type="bars" size="full" />
}

export default IndexPage
