import { useSession } from "next-auth/client";
import { useAccount } from "@/lib/swr-hooks";
import { useAtom } from "jotai";
import { clerkAtom, menuDisplayAtom, pageAtom } from "./api/atoms";

import Nav from "@/components/nav";
import Menu from "@/components/menu";
import SellScreen from "./sell";
import SignOutButton from "@/components/button/sign-out-button";

export default function MainPage() {
  // Get google auth details
  const [session] = useSession();
  const { account } = useAccount(session?.user?.email);

  const [clerk] = useAtom(clerkAtom);
  const [menuDisplay] = useAtom(menuDisplayAtom);
  const [page] = useAtom(pageAtom);

  return (
    <>
      <Nav />
      <div className="flex h-menu relative">
        <Menu />
        <div className="bg-green-500 h-full w-full absolute sm:static">
          {page === "sell" && <SellScreen />}
        </div>
      </div>
    </>
  );
}
