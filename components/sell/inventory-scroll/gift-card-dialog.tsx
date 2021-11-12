// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useGiftCards,
  useSaleInventory,
  useLogs,
  useWeather,
} from "@/lib/swr-hooks";
import { viewAtom, newSaleObjectAtom, clerkAtom, alertAtom } from "@/lib/atoms";
import { GiftCardObject, ModalButton } from "@/lib/types";

// Functions
import { getGeolocation } from "@/lib/data-functions";
import { saveLog, saveStockToDatabase } from "@/lib/db-functions";

// Components
import Modal from "@/components/container/modal";
import TextField from "@/components/inputs/text-field";

import SyncIcon from "@mui/icons-material/Sync";

export default function GiftCardDialog() {
  // Atoms
  const [clerk] = useAtom(clerkAtom);
  const [view, setView] = useAtom(viewAtom);
  const [, setAlert] = useAtom(alertAtom);
  const [cart, setCart] = useAtom(newSaleObjectAtom);

  // SWR
  const { giftCards, mutateGiftCards } = useGiftCards();
  const { logs, mutateLogs } = useLogs();
  const { saleInventory, mutateSaleInventory } = useSaleInventory();
  const geolocation = getGeolocation();
  const { weather } = useWeather();

  // State
  const [giftCardCode, setGiftCardCode] = useState(makeGiftCardCode());
  const [amount, setAmount] = useState("20");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Functions
  function makeGiftCardCode() {
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var charactersLength = characters.length;
    let result = "";
    while (
      result === "" ||
      giftCards?.map((g: GiftCardObject) => g?.gift_card_code).includes(result)
    ) {
      result = "";
      for (var i = 0; i < 6; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
    }
    return result;
  }

  const buttons: ModalButton[] = [
    {
      type: "ok",
      disabled: amount !== "" && isNaN(parseFloat(amount)),
      loading: submitting,
      onClick: async () => {
        setSubmitting(true);
        let newGiftCard: GiftCardObject = {
          is_gift_card: true,
          gift_card_code: giftCardCode,
          gift_card_amount: parseFloat(amount) * 100,
          gift_card_remaining: parseFloat(amount) * 100,
          gift_card_note: notes,
          gift_card_is_valid: false,
        };
        const id = await saveStockToDatabase(newGiftCard, clerk);
        mutateGiftCards([...giftCards, { ...newGiftCard, id }], false);
        mutateSaleInventory([...saleInventory, { ...newGiftCard, id }], false);
        setSubmitting(false);
        setGiftCardCode(null);
        setNotes("");
        setAmount("");

        // Add to cart
        let newItems = cart?.items || [];
        newItems.push({
          item_id: id,
          quantity: "1",
          is_gift_card: true,
        });
        setCart({
          id: cart?.id || null,
          // REVIEW check the date to string thing works ok
          date_sale_opened: cart?.date_sale_opened || new Date().toString(),
          sale_opened_by: cart?.sale_opened_by || clerk?.id,
          items: newItems,
          weather: cart?.weather || weather,
          geo_latitude: cart?.geo_latitude || geolocation?.latitude,
          geo_longitude: cart?.geo_longitude || geolocation?.longitude,
        });
        setView({ ...view, giftCardDialog: false, cart: true });
        saveLog(
          {
            log: `New gift card (#${newGiftCard?.gift_card_code?.toUpperCase()}) created and added to cart.`,
            clerk_id: clerk?.id,
            table_id: "stock",
            row_id: id,
          },
          logs,
          mutateLogs
        );
        setAlert({
          open: true,
          type: "success",
          message: `NEW GIFT CARD CREATED`,
        });
      },
      text: "CREATE GIFT CARD",
    },
  ];

  return (
    <Modal
      open={view?.giftCardDialog}
      closeFunction={() => setView({ ...view, giftCardDialog: false })}
      title={"CREATE GIFT CARD"}
      buttons={buttons}
    >
      <>
        <div className="flex justify-between items-center">
          <div className="text-8xl text-red-800 font-mono">{giftCardCode}</div>
          <button
            className="icon-button-small-mid"
            onClick={() => setGiftCardCode(makeGiftCardCode())}
          >
            <SyncIcon />
          </button>
        </div>
        <TextField
          className="mt-8"
          divClass="text-8xl"
          startAdornment="$"
          inputClass="text-center"
          value={amount}
          error={isNaN(parseFloat(amount))}
          onChange={(e: any) => setAmount(e.target.value)}
        />
        <TextField
          inputLabel="Notes"
          value={notes}
          onChange={(e: any) => setNotes(e.target.value)}
          multiline
          rows={3}
        />
      </>
    </Modal>
  );
}