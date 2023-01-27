import { VpnKey } from '@mui/icons-material'
import { useRouter } from 'next/router'

export default function OpenRegisterNavActions() {
  const router = useRouter()

  return (
    <div className="flex">
      <button className="icon-text-button" onClick={() => router.push('/register/open')}>
        <VpnKey className="mr-1" />
        <div className="hidden lg:inline">Open Register</div>
      </button>
    </div>
  )
}
