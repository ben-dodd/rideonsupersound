import { useAtom } from "jotai";
import { showSaleScreenAtom } from "@/lib/atoms";

export default function SaleSummary() {
  const [, setShowSaleScreen] = useAtom(showSaleScreenAtom);
  function onClickGoBack() {
    setShowSaleScreen(false);
  }
  return (
    <div className="flex flex-col justify-between h-menu px-2 bg-blue-200 text-black">
      Sale Summary
      <button
        className="fab-button__secondary w-full my-4 mr-2"
        onClick={onClickGoBack}
      >
        BACK
      </button>
    </div>
  );
}
