import Clerk from "@/components/clerk";
import SignOutButton from "@/components/_components/button/sign-out-button";

import { ClerkObject } from "@/lib/types";

export default function SplashPage({ clerks }) {
  return (
    <div className="bg-black h-screen">
      <div className="flex flex-col max-w-screen-md sm:w-full sm:h-full mx-auto">
        <div className="p-8 text-center text-xl font-bold text-white">
          CHOOSE YOUR FIGHTER
        </div>
        <div className="grid md:grid-cols-3 gap-8 place-items-center align-center mb-8">
          {clerks?.map((c: ClerkObject) => (
            <Clerk key={c?.id} clerk={c} />
          ))}
        </div>
        <SignOutButton />
      </div>
    </div>
  );
}
