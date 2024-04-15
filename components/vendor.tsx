import { useRouter } from 'next/router'

const Vendor = ({ id }) => {
  const router = useRouter()
  router.push(`https://vendor.rideonsupersound.co.nz/${id}`)
  return <div></div>
}

export default Vendor
