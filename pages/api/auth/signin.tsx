import { useSession } from "next-auth/client";
import Image from "next/image";

import SignInButton from "@/components/button/sign-in-button";

export default function SignIn() {
  console.log("Sign in");
  const [session] = useSession();
  return (
    <div className="flex flex-col h-screen justify-center">
      <div className="mx-auto mb-8">
        <Image
          src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/logo_400.png`}
          height={200}
          width={200}
        />
      </div>
      <SignInButton />
      {session && (
        <div className="text-xs px-8 pt-4 text-center">
          <b>{session?.user?.email}</b>
          <br />
          is not an authenticated email address
        </div>
      )}
    </div>
  );
}
