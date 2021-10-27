import { useAccount, useRegisterID } from "@/lib/swr-hooks";
import { useSession } from "next-auth/client";
import LandingPage from "@/components/main/landing-page";
import SignIn from "./api/auth/signin";

export default function IndexPage() {
  const [session, sessionLoading] = useSession();
  const { account } = useAccount(session?.user?.email);
  useRegisterID();

  return (
    <>
      {sessionLoading ? (
        <div className="flex h-screen w-screen">
          <div className="loading-icon" />
        </div>
      ) : session ? (
        account?.is_authenticated ? (
          <LandingPage />
        ) : (
          <SignIn />
        )
      ) : (
        <SignIn />
      )}
    </>
  );
}
