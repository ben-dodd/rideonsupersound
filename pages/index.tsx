import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import Loading from 'components/placeholders/loading'
import { useEffect } from 'react'
import { useAppStore } from 'lib/store'

export default function IndexPage() {
  const { registerId } = useAppStore()
  const router = useRouter()
  useEffect(() => {
    console.log('Register ID is ', registerId)
    if (registerId) router?.push('/sell')
    else router?.push('/register/open')
  }, [registerId, router])

  return <Loading type="pyramid" size="full" />
}

export const getServerSideProps = withPageAuthRequired()
