import { useEffect } from "react";
import { useAccount, useInventory, useAccountClerks } from "@/lib/swr-hooks";
import { useSession } from "next-auth/client";
import { useAtom } from "jotai";
import { clerkAtom } from "@/lib/atoms";

import MainPage from "./main-page";
import SplashPage from "./splash-page";

export default function LandingPage() {
  // Get google auth details
  const [session] = useSession();
  const { account } = useAccount(session?.user?.email);
  useInventory();

  // Get clerk details
  const { clerks, isLoading } = useAccountClerks(account?.id);
  const [clerk, setClerk] = useAtom(clerkAtom);
  console.log(clerks);

  useEffect(() => {
    // If google account only connected to one clerk, automatically set clerk
    if (clerks && clerks.length === 1) setClerk(clerks[0]);
  }, clerks);

  return (
    <>
      {isLoading ? (
        <div className="loading-screen">
          <div className="loading-icon" />
        </div>
      ) : clerk?.id ? (
        <MainPage />
      ) : (
        <SplashPage clerks={clerks} />
      )}
    </>
  );
}
