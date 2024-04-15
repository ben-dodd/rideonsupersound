import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Vendor = ({ id }) => {
  const router = useRouter()
  console.log(id)

  useEffect(() => {
    console.log(id)
    if (id) {
      console.log('correct')
      // router.push(`https://vendor.rideonsupersound.co.nz/${id}`)
    } else {
      console.error('ID is undefined or null')
    }
  }, [id, router])

  return <div></div>
}

export default Vendor
