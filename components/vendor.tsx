import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Vendor = ({ id }) => {
  const router = useRouter()

  useEffect(() => {
    if (id) {
      console.log(`Redirecting to ${id}`)
      router.push(`https://vendor.rideonsupersound.co.nz/${id}`)
    } else {
      console.error('ID is undefined or null')
    }
  }, [id, router])

  return <div></div>
}

export default Vendor
