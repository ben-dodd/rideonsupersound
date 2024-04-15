import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Vendor = ({ id }) => {
  const router = useRouter()
  useEffect(() => {
    router.push(`https://vendor.rideonsupersound.co.nz/${id}`)
  }, [])
  return <div></div>
}

export default Vendor
