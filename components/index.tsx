import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Index = () => {
  const router = useRouter()
  useEffect(() => {
    router.push('https://shop.rideonsupersound.co.nz')
  }, [])
  return <div></div>
}

export default Index
