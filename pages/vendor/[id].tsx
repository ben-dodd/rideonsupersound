import { useRouter } from 'next/router'

export default function VendorPage() {
  const router = useRouter()
  const { id } = router.query
  router.push(`https://vendor.rideonsupersound.co.nz/${id}`)
  return <div />
}
