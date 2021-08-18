import { useAccount } from "@/lib/swr-hooks";
import { useSession } from "next-auth/client";
import LandingPage from "@/components/main/landing-page";
import SignIn from "./api/auth/signin";

export default function IndexPage() {
  const [session, sessionLoading] = useSession();
  const { account } = useAccount(session?.user?.email);

  return (
    <>
      {sessionLoading || (session && !account) ? (
        <div className="loading-screen">
          <div className="loading-icon" />
        </div>
      ) : session ? (
        account?.is_authenticated ? (
          <LandingPage />
        ) : (
          <SignIn account={account} />
        )
      ) : (
        <>
          <SignIn account={account} />
        </>
      )}
    </>
  );
}
