import { signOut } from "next-auth/client";

export default function SignOutButton() {
  return (
    <button
      className="bg-white hover:bg-gray-200 text-black mx-auto rounded px-8 py-2 mt-4 mb-8"
      onClick={() => signOut()}
    >
      Sign Out
    </button>
  );
}
