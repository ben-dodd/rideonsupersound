import GiftCardTable from "./gift-card-table";
import { useAtom } from "jotai";
import { pageAtom } from "@/lib/atoms";

export default function GiftCardScreen() {
  const [page] = useAtom(pageAtom);
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "giftCards" ? "hidden" : ""
      }`}
    >
      {" "}
      <GiftCardTable />
    </div>
  );
}
