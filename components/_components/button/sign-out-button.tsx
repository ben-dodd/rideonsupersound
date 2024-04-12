// import { signOut } from 'next-auth/client'
import { useRouter } from 'next/router'

export default function SignOutButton() {
  const router = useRouter()
  return (
    <button
      className="bg-white hover:bg-gray-200 text-black mx-auto rounded px-8 py-2 mt-4 mb-8"
      onClick={() => router.push('/api/auth/logout')}
    >
      Sign Out
    </button>
  )
}
