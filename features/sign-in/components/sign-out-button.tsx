import Link from 'next/link'
export default function SignOutButton() {
  return (
    <button className="bg-white hover:bg-gray-200 text-black mx-auto rounded px-8 py-2 mt-4 mb-8">
      <Link href="/api/auth/logout">Sign Out</Link>
    </button>
  )
}
