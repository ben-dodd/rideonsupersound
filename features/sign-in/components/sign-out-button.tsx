import { useAuth0 } from '@auth0/auth0-react'

export default function SignOutButton() {
  const { logout } = useAuth0()
  return (
    <button
      className="bg-white hover:bg-gray-200 text-black mx-auto rounded px-8 py-2 mt-4 mb-8"
      onClick={() => logout()}
    >
      Sign Out
    </button>
  )
}
