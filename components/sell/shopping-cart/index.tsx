// Packages
import { useState } from "react";
import { useAtom } from "jotai";

// DB
import {
  useSaleInventory,
  useLogs,
  useSales,
  useSaleItems,
} from "@/lib/swr-hooks";
import { newSaleObjectAtom, viewAtom, clerkAtom, alertAtom } from "@/lib/atoms";
import { InventoryObject, SaleStateTypes } from "@/lib/types";

// Functions
import {
  getTotalPrice,
  getTotalStoreCut,
  writeItemList,
  getItemDisplayName,
} from "@/lib/data-functions";
import {
  saveSaleAndItemsToDatabase,
  deleteSaleFromDatabase,
  deleteSaleItemFromDatabase,
  saveLog,
} from "@/lib/db-functions";

// Components
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Actions from "./actions";
import ListItem from "./list-item";

// Icons
import PayIcon from "@mui/icons-material/ShoppingCart";
import HoldIcon from "@mui/icons-material/PanTool";

export default function ShoppingCart() {
  // SWR
  const { saleInventory } = useSaleInventory();
  const { sales, mutateSales } = useSales();
  const { saleItems, mutateSaleItems } = useSaleItems();
  const { logs, mutateLogs } = useLogs();

  // Atoms
  const [view, setView] = useAtom(viewAtom);
  const [clerk] = useAtom(clerkAtom);
  const [cart, setCart] = useAtom(newSaleObjectAtom);
  const [, setAlert] = useAtom(alertAtom);
  const [, setSale] = useAtom(newSaleObjectAtom);

  // State
  const [loadingSale, setLoadingSale] = useState(false);

  const itemList = writeItemList(saleInventory, cart?.items);
  console.log(cart);

  // Functions
  async function loadSale() {
    try {
      setLoadingSale(true);
      const id = await saveSaleAndItemsToDatabase(
        { ...cart, state: SaleStateTypes.InProgress },
        cart?.items,
        clerk,
        sales,
        mutateSales,
        saleItems,
        mutateSaleItems
      );
      setLoadingSale(false);
      saveLog(
        {
          log: `New sale #${id} loaded. ${itemList}.`,
          clerk_id: clerk?.id,
          table_id: "sale",
          row_id: id,
        },
        logs,
        mutateLogs
      );
      setSale({ ...cart, id });
      setView({ ...view, saleScreen: true });
    } catch (e) {
      throw Error(e.message);
    }
  }

  async function deleteCartItem(itemId: string, id: number) {
    let newItems = cart?.items.filter((i) => i?.item_id !== parseInt(itemId));
    if (id)
      // Cart has been saved to the database, delete sale_item
      deleteSaleItemFromDatabase(id);
    if (cart?.items?.length < 1) {
      // No items left, delete cart
      setView({ ...view, cart: false });
      // TODO Any transactions need to be refunded.
      deleteSaleFromDatabase(cart?.id);
    }
    setCart({ ...cart, items: newItems });
    saveLog(
      {
        log: `${getItemDisplayName(
          saleInventory?.filter(
            (i: InventoryObject) => i?.id === parseInt(itemId)
          )[0]
        )} removed from cart${id ? ` (sale #${id})` : ""}.`,
        clerk_id: clerk?.id,
      },
      logs,
      mutateLogs
    );
    setAlert({
      open: true,
      type: "success",
      message: `ITEM REMOVED FROM CART`,
    });
    // setRefresh(refresh + 1);
  }

  // Constants
  const totalPrice = getTotalPrice(cart?.items, saleInventory);
  const storeCut = getTotalStoreCut(cart?.items, saleInventory);
  const disableButtons =
    loadingSale || !(cart?.items && Object.keys(cart?.items).length > 0);

  return (
    <div
      className={`absolute top-0 transition-offset duration-300 ${
        view?.cart ? "left-0" : "left-full"
      } sm:left-2/3 h-full w-full bg-yellow-200 sm:w-1/3 sm:h-menu`}
    >
      <div className="flex flex-col h-menu px-2 bg-black text-white">
        <div className="flex justify-between mb-2 relative">
          <div className="text-lg my-2 tracking-wide self-center">
            Shopping Cart
          </div>
          <Actions />
        </div>
        <div className="flex-grow overflow-x-hidden overflow-y-scroll">
          {cart?.items?.length > 0 ? (
            cart.items.map((cartItem, id) => (
              <ListItem
                key={cartItem?.item_id}
                index={id}
                cartItem={cartItem}
                deleteCartItem={deleteCartItem}
              />
            ))
          ) : (
            <Tooltip title="To add items to the cart. Use the search bar and then add items with the (+) icon.">
              <div>No items in cart...</div>
            </Tooltip>
          )}
        </div>
        <div className="pt-4">
          <div className="flex justify-between">
            <button
              className="fab-button__secondary w-1/3"
              disabled={disableButtons}
              onClick={() => setView({ ...view, createHold: true })}
            >
              <HoldIcon className="mr-2" />
              HOLD
            </button>
            <div>
              <div className="flex justify-end mt-2">
                <div className="self-center">STORE CUT</div>
                <div
                  className={`self-center text-right ml-7 ${
                    storeCut < 0 ? "text-red-500" : "text-white"
                  }`}
                >
                  {storeCut < 0 && "-"}$
                  {cart?.items?.length > 0
                    ? Math.abs(storeCut / 100)?.toFixed(2)
                    : "0.00"}
                </div>
              </div>
              <div className="flex justify-end mt-1">
                <div className="self-center">TOTAL</div>
                <div className="self-center text-right ml-4">
                  ${((totalPrice || 0) / 100)?.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          <div>
            <button
              className="fab-button w-full my-4"
              disabled={disableButtons}
              onClick={() => loadSale()}
            >
              {loadingSale ? (
                <span className="pr-4">
                  <CircularProgress color="inherit" size={18} />
                </span>
              ) : (
                <PayIcon className="mr-2" />
              )}
              MAKE THEM PAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// TODO button should be disabled if any fields on the shopping items are invalid (e.g. discount is over 100 etc.)
