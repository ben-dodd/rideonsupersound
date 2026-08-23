import Loading from 'components/placeholders/loading'
import { useCurrentRegisterId } from 'lib/api/register'
import { auth0 } from 'lib/auth0'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function IndexPage() {
  const router = useRouter()
  const { registerId, isRegisterIdLoading } = useCurrentRegisterId()
  useEffect(() => {
    if (!isRegisterIdLoading) {
      if (registerId) router?.push('/sell')
      else router?.push('/register/open')
    }
  }, [registerId, isRegisterIdLoading, router])

  return <Loading type="pyramid" size="full" />
}

export const getServerSideProps = auth0.withPageAuthRequired()
