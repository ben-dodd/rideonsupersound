import { receiveStockAtom } from "@/lib/atoms";
import { getItemDisplayName } from "@/lib/data-functions";
import { useInventory } from "@/lib/swr-hooks";
import { InventoryObject } from "@/lib/types";
import { useAtom } from "jotai";
import TextField from "@/components/_components/inputs/text-field";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CheckDetails() {
  const [bucket, setBucket] = useAtom(receiveStockAtom);
  const { inventory } = useInventory();
  return (
    <div>
      <div className="flex justify-between">
        <div className="font-bold text-xl">Current Items</div>
        <div className="font-bold mr-12">Quantity Received</div>
      </div>
      {Object.keys(bucket?.items || {}).length > 0 ? (
        Object.entries(bucket?.items || {}).map(([itemId, itemQuantity]) => {
          const item: InventoryObject = inventory?.filter(
            (i: InventoryObject) => i?.id === parseInt(itemId)
          )[0];
          return (
            <div className="flex justify-between my-2 border-b">
              <div className="flex">
                <img
                  src={item?.image_url}
                  alt={item?.title}
                  className="inventory-item-image-small"
                />
                <div className="ml-2">
                  {getItemDisplayName(item)}
                  <div
                    className={`mt-2 text-sm font-bold ${
                      item?.quantity <= 0 ? "text-tertiary" : "text-black"
                    }`}
                  >{`${item?.quantity} in stock.`}</div>
                </div>
              </div>
              <div className="self-center flex items-center">
                <TextField
                  className="w-12 mr-6"
                  inputType="number"
                  min={0}
                  value={`${itemQuantity}`}
                  onChange={(e: any) =>
                    setBucket({
                      ...bucket,
                      items: {
                        ...(bucket?.items || []),
                        [itemId]: e.target.value,
                      },
                    })
                  }
                />
                <button
                  className="bg-gray-200 hover:bg-gray-300 p-1 w-10 h-10 rounded-full mr-8"
                  onClick={() => {
                    let newItems = bucket?.items || {};
                    delete newItems[itemId];
                    setBucket({ ...bucket, newItems });
                  }}
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div>Select vendor to start adding items.</div>
      )}
    </div>
  );
}
