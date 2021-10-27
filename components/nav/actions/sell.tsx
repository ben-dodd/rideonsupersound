import { useAtom } from "jotai";
import { viewAtom } from "@/lib/atoms";
// Material UI Icons
import AddCashIcon from "@mui/icons-material/AttachMoney";
import TakeCashIcon from "@mui/icons-material/MoneyOff";
import CloseRegisterIcon from "@mui/icons-material/VpnKey";

export default function SellNavActions() {
  const [view, setView] = useAtom(viewAtom);

  return (
    <div className="flex">
      <button
        className="icon-text-button"
        onClick={() => setView({ ...view, returnCashDialog: true })}
      >
        <AddCashIcon className="mr-1" />
        Add Cash
      </button>
      <button
        className="icon-text-button"
        onClick={() => setView({ ...view, takeCashDialog: true })}
      >
        <TakeCashIcon className="mr-1" />
        Take Cash
      </button>
      <button
        className="icon-text-button"
        onClick={() => setView({ ...view, closeRegisterScreen: true })}
      >
        <CloseRegisterIcon className="mr-1" />
        Close Register
      </button>
    </div>
  );
}
