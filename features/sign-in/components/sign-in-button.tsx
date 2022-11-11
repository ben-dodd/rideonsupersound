import { useAuth0 } from '@auth0/auth0-react'

export default function SignInButton() {
  const { loginWithPopup } = useAuth0()
  return (
    <button
      className="bg-black hover:bg-gray-900 text-white mx-auto rounded px-8 py-2 mt-4 mb-8 transform"
      onClick={loginWithPopup}
    >
      Sign In
    </button>
  )
}
