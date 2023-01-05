import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import Loading from 'components/loading'
import { useEffect } from 'react'

export default function IndexPage() {
  const router = useRouter()
  useEffect(() => {
    router?.push('sell')
  })

  return <Loading type="pyramid" size="full" />
}

export const getServerSideProps = withPageAuthRequired()
