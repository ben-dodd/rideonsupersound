import { useAtom } from "jotai";
import { showCloseRegisterScreenAtom, pettyCashAtom } from "@/lib/atoms";
// Material UI Icons
import AddCashIcon from "@mui/icons-material/AttachMoney";
import TakeCashIcon from "@mui/icons-material/MoneyOff";
import CloseRegisterIcon from "@mui/icons-material/VpnKey";

export default function SellNavActions() {
  const [, setPettyCash] = useAtom(pettyCashAtom);
  const [, showCloseRegisterScreen] = useAtom(showCloseRegisterScreenAtom);

  return (
    <div className="flex">
      <button className="icon-text-button" onClick={() => setPettyCash(1)}>
        <AddCashIcon className="mr-1" />
        Return Cash
      </button>
      <button className="icon-text-button" onClick={() => setPettyCash(2)}>
        <TakeCashIcon className="mr-1" />
        Take Cash
      </button>
      <button
        className="icon-text-button"
        onClick={() => showCloseRegisterScreen(true)}
      >
        <CloseRegisterIcon className="mr-1" />
        Close Register
      </button>
    </div>
  );
}
