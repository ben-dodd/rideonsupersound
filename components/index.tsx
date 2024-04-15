import { useRouter } from 'next/router'

const Index = () => {
  const router = useRouter()
  router.push('https://shop.rideonsupersound.co.nz')
  return <div></div>
}

export default Index
