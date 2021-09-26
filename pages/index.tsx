import { useAccount } from "@/lib/swr-hooks";
import { useSession } from "next-auth/client";
import LandingPage from "@/components/main/landing-page";
import SignIn from "./api/auth/signin";

export default function IndexPage() {
  const [session, sessionLoading] = useSession();
  const { account } = useAccount(session?.user?.email);
  console.log(session);
  console.log(account);
  console.log(account?.is_authenticated);
  console.log(sessionLoading);
  console.log(session && !account);

  return (
    <>
      {sessionLoading ? (
        <div className="loading-screen">
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
