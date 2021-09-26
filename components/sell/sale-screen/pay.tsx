import { useMemo, useState } from "react";
import { useAtom } from "jotai";
import {
  useInventory,
  useSaleTransactions,
  useContacts,
  useVendorFromContact,
} from "@/lib/swr-hooks";
import {
  cartAtom,
  paymentDialogAtom,
  showSaleScreenAtom,
  showCreateContactAtom,
} from "@/lib/atoms";
import { ContactObject } from "@/lib/types";
import {
  getTotalPrice,
  // getTotalStoreCut,
  getRemainingBalance,
} from "@/lib/data-functions";
import CreateableSelect from "@/components/inputs/createable-select";
import TextField from "@/components/inputs/text-field";
import BackIcon from "@material-ui/icons/ChevronLeft";

export default function Pay() {
  const [cart, setCart] = useAtom(cartAtom);
  const [paymentDialog, openPaymentDialog] = useAtom(paymentDialogAtom);
  const [, setCreateContactScreen] = useAtom(showCreateContactAtom);
  const [showSaleScreen, setShowSaleScreen] = useAtom(showSaleScreenAtom);
  const { inventory } = useInventory();
  const { contacts } = useContacts();
  const { vendor } = useVendorFromContact(cart?.contact_id);
  const { transactions } = useSaleTransactions(cart?.id);
  const [note, setNote] = useState("");
  const totalPrice = useMemo(() => getTotalPrice(cart, inventory), [
    cart,
    inventory,
    showSaleScreen,
  ]);
  const remainingBalance = useMemo(
    () => getRemainingBalance(totalPrice, transactions) / 100,
    [totalPrice, transactions]
  );
  function onClickGoBack() {
    setShowSaleScreen(false);
  }
  return (
    <div className="flex flex-col justify-between">
      <div>
        <div className="flex justify-between my-2">
          <button onClick={onClickGoBack}>
            <BackIcon />
          </button>
          <div className="text-2xl font-bold">LEFT TO PAY</div>
          <div className="text-2xl text-red-500 font-bold text-xl">
            ${(remainingBalance || 0).toFixed(2)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            className="square-button"
            disabled={remainingBalance === 0}
            onClick={() => openPaymentDialog("cash")}
          >
            CASH
          </button>
          <button
            className="square-button"
            disabled={remainingBalance === 0}
            onClick={() => openPaymentDialog("card")}
          >
            CARD
          </button>
          <button
            className="square-button"
            disabled={!cart?.contact_id || !vendor || remainingBalance === 0}
            onClick={() => openPaymentDialog("acct")}
          >
            ACCT
            <div
              className={`text-xs ${cart?.contact_id ? "hidden" : "w-full"}`}
            >
              Contact Required
            </div>
          </button>
          <button
            className="square-button"
            disabled={remainingBalance === 0}
            onClick={() => openPaymentDialog("gift")}
          >
            GIFT
          </button>
        </div>
        <CreateableSelect
          inputLabel="Select contact"
          value={cart?.contact_id}
          label={
            (contacts || []).filter(
              (c: ContactObject) => c?.id === cart?.contact_id
            )[0]?.name || ""
          }
          onChange={(contactObject: any) => {
            setCart({
              ...cart,
              contact_id: parseInt(contactObject?.value),
            });
          }}
          onCreateOption={(inputValue: string) =>
            setCreateContactScreen({
              id: 1,
              name: inputValue,
            })
          }
          options={contacts?.map((val: ContactObject) => ({
            value: val?.id,
            label: val?.name || "",
          }))}
          disabled={Boolean(paymentDialog)}
        />
        <TextField
          inputLabel="Note"
          multiline
          value={note}
          onChange={(e: any) => setNote(e.target.value)}
        />
      </div>
    </div>
  );
}
