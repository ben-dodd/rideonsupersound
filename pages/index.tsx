import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import Loading from 'components/loading'
import { useEffect } from 'react'
import { useCurrentRegisterId } from 'lib/api/register'

export default function IndexPage() {
  const router = useRouter()
  const { currentRegisterId, isCurrentRegisterIdLoading } = useCurrentRegisterId()
  useEffect(() => {
    if (!isCurrentRegisterIdLoading) {
      if (currentRegisterId) router?.push('/sell')
      else router?.push('/register/open')
    }
  }, [currentRegisterId, isCurrentRegisterIdLoading, router])

  return <Loading type="pyramid" size="full" />
}

export const getServerSideProps = withPageAuthRequired()
