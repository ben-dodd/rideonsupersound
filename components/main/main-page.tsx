import { useAtom } from "jotai";
import { pageAtom } from "@/lib/atoms";

import Nav from "@/components/nav";
import Menu from "@/components/menu";
import SellScreen from "@/components/sell";

export default function MainPage() {
  // Get google auth details
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
