import Clerk from "@/components/clerk";
import SignOutButton from "@/components/button/sign-out-button";

import { ClerkObject } from "@/lib/types";

export default function SplashPage({ clerks }) {
  return (
    <div className="flex flex-col max-w-screen-md mx-auto">
      <div className="p-8 text-center text-xl font-bold text-black">
        CHOOSE YOUR STORE CLERK
      </div>
      <div className="grid md:grid-cols-3 gap-8 place-items-center align-center mb-8">
        {clerks?.map((c: ClerkObject) => (
          <Clerk key={c?.id} clerk={c} />
        ))}
      </div>
      <SignOutButton />
    </div>
  );
}
