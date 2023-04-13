import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import Loading from 'components/placeholders/loading'
import { useEffect } from 'react'
import { useCurrentRegisterId } from 'lib/api/register'

export default function IndexPage() {
  const router = useRouter()
  const { registerId, isRegisterIdLoading } = useCurrentRegisterId()
  useEffect(() => {
    if (!isRegisterIdLoading) {
      console.log('current id', registerId)
      if (registerId) router?.push('/sell')
      else router?.push('/register/open')
    }
  }, [registerId, isRegisterIdLoading, router])

  return <Loading type="pyramid" size="full" />
}

export const getServerSideProps = withPageAuthRequired()
