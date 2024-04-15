import Vendor from '@/components/vendor'
import { useRouter } from 'next/router'

export default function VendorPage() {
  const router = useRouter()
  const { id } = router.query
  console.log(id)
  return <Vendor id={id} />
}
