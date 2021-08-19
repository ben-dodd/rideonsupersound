import { signIn } from "next-auth/client";

export default function SignInButton() {
  return (
    <button
      className="bg-black hover:bg-gray-900 text-white mx-auto rounded px-8 py-2 mt-4 mb-8 transform hover:shadow-2xl"
      onClick={() => signIn()}
    >
      Sign In
    </button>
  );
}
