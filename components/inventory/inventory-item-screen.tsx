// Packages
import { useState, useEffect } from "react";
import { useAtom } from "jotai";

// DB
import { useStockItem, useInventory } from "@/lib/swr-hooks";
import { loadedItemIdAtom } from "@/lib/atoms";
import { StockObject, ModalButton } from "@/lib/types";

// Functions
import { getItemDisplayName } from "@/lib/data-functions";
import { updateStockItemInDatabase } from "@/lib/db-functions";

// Components
import Image from "next/image";
import Tabs from "@/components/_components/navigation/tabs";
import TextField from "@/components/_components/inputs/text-field";
import DiscogsPanel from "./discogs-panel";
import GoogleBooksPanel from "./google-books-panel";
import ScreenContainer from "@/components/_components/container/screen";
import InventoryItemForm from "./receive-stock-screen/inventory-item-form";
import StockDetails from "./stock-details";
import PriceDetails from "./price-details";

export default function InventoryItemScreen({ page }) {
  // Atoms
  const [loadedItemId, setLoadedItemId] = useAtom(loadedItemIdAtom);

  // SWR
  const { stockItem, isStockItemLoading } = useStockItem(loadedItemId[page]);
  const { inventory, mutateInventory } = useInventory();

  // State
  const [item, setItem]: [StockObject, Function] = useState(null);
  const [tab, setTab] = useState(0);

  // Load
  useEffect(() => {
    let newItem = { ...stockItem };
    // Parse JSON fields
    newItem.discogsItem = newItem?.discogsItem
      ? JSON.parse(newItem.discogsItem)
      : null;
    newItem.googleBooksItem = newItem?.googleBooksItem
      ? JSON.parse(newItem.googleBooksItem)
      : null;
    setItem(newItem);
  }, [stockItem]);

  // Functions
  function onClickDelete() {
    // REVIEW Delete inventory item
  }

  const buttons: ModalButton[] = [
    {
      type: "cancel",
      onClick: () => setLoadedItemId({ ...loadedItemId, [page]: 0 }),
      text: "CLOSE",
    },
    {
      type: "ok",
      onClick: () => {
        let otherInventoryItems = inventory?.filter(
          (i: StockObject) => i?.id !== stockItem?.id
        );
        mutateInventory(
          [...otherInventoryItems, { ...stockItem, ...item }],
          false
        );
        updateStockItemInDatabase(item);
        setLoadedItemId({ ...loadedItemId, [page]: 0 });
        setItem(null);
        // setTimeout(() => setItem(null), 1000);
      },
      text: "SAVE",
    },
  ];

  const titleClass = page === "sell" ? "bg-col1" : "bg-col2";

  return (
    <ScreenContainer
      show={Boolean(loadedItemId[page])}
      closeFunction={() => {
        setLoadedItemId({ ...loadedItemId, [page]: 0 });
      }}
      title={getItemDisplayName(item)}
      loading={isStockItemLoading}
      buttons={buttons}
      titleClass={titleClass}
    >
      <div className="flex flex-col w-full">
        <Tabs
          tabs={[
            "General Information",
            item?.media === "Audio"
              ? "Discogs"
              : item?.media === "Literature"
              ? "GoogleBooks"
              : null,
            // "Sale Details",
          ]}
          value={tab}
          onChange={setTab}
        />
        <div hidden={tab !== 0}>
          <div className="flex">
            <div className="w-1/2">
              <InventoryItemForm item={item} setItem={setItem} />
            </div>
            <div className="w-1/2 ml-4">
              <PriceDetails item={item} />
              <StockDetails item={item} />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="p-1 border border-black hover:bg-tertiary rounded-xl mt-2"
              onClick={onClickDelete}
            >
              Delete Item
            </button>
          </div>
        </div>
        <div
          hidden={
            !(
              tab === 1 &&
              (item?.media === "Audio" ||
                item?.media === "Video" ||
                item?.media === "Mixed")
            )
          }
        >
          <DiscogsPanel item={item} setItem={setItem} />
        </div>
        <div hidden={!(tab === 1 && item?.media === "Literature")}>
          <GoogleBooksPanel item={item} setItem={setItem} />
        </div>
        <div hidden={tab !== 2}>Item Sale Details</div>
      </div>
    </ScreenContainer>
  );
}

// REVIEW delay removing inventory item
// REVIEW update inventory quicker
// REVIEW add logs etc. if modified

// ONCLICKSAVE
// () => {
//   if (newItem) delete item.newItem;
//   if (onClose) {
//     onClose();
//     delete item.onClose;
//   }
//   updateData({
//     dispatch,
//     collection: "inventory",
//     doc: get(item, "id"),
//     update: item,
//     forceNew: newItem,
//   });
//   if (newItem) {
//     updateData({
//       dispatch,
//       collection: "settings",
//       doc: "ids",
//       storeAs: "ids",
//       update: { item: parseInt(nextItemId) + 1 },
//     });
//     addLog(
//       "New inventory item created.",
//       "inventory",
//       get(item, "id", ""),
//       currentStaff
//     );
//   } else if (!isEqual(item, inventoryDialog))
//     addLog(
//       "Inventory item updated.",
//       "inventory",
//       get(item, "id", ""),
//       currentStaff
//     );
//   dispatch(closeDialog("inventory"));
//   setItem({});
// }

// IMAGE UPLOADS
// const fileUpload = useSelector((state) => state.local.fileUpload);
// const onDrop = useCallback(
//   (acceptedFiles) => {
//     if (acceptedFiles.length > 1) {
//       dispatch(
//         setAlert({
//           message: `IMAGE UPLOAD FAILED. ONLY ONE IMAGE PERMITTED FOR PRODUCT.`,
//           type: "error",
//         })
//       );
//     } else {
//       let file = acceptedFiles[0];
//       if (!file.type.includes("image")) {
//         dispatch(
//           setAlert({
//             message: "IMAGE UPLOAD FAILED. FILE NOT AN IMAGE.",
//             type: "error",
//           })
//         );
//       } else {
//         dispatch(
//           onUploadFile({
//             file,
//             storagePath: "inventory/",
//             callback: ({ path, url }) => {
//               setItem({ ...item, imageRef: path, image: url });
//             },
//           })
//         );
//       }
//     }
//   },
//   [item, dispatch]
// );
// const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

// <div {...getRootProps()}>
//   <input {...getInputProps()} />
//   <img
//     alt={"Artwork"}
//     className={
//       isDragActive
//         ? "thumbnail-image--dragging"
//         : "thumbnail-image"
//     }
//     src={get(item, "image", defaultImage)}
//   />
// </div>
// <div className="text-xs">Drag image or click to select file.</div>
// {fileUpload.isUploading && (
//   <div>{`${Math.round(
//     fileUpload.uploadProgress
//   )}% UPLOADED...`}</div>
// )}

// <TextField
//   inputClass="font-bold"
//   inputLabel="SELL PRICE"
//   value={`${(item?.total_sell / 100)?.toFixed(2)}` || ""}
//   onChange={(e: any) =>
//     setItem({ ...item, total_sell: e.target.value })
//   }
//   startAdornment="$"
// />
// <TextField
//   inputLabel="COST PRICE"
//   value={`${(item?.vendor_cut / 100)?.toFixed(2)}` || ""}
//   onChange={(e: any) =>
//     setItem({ ...item, vendor_cut: e.target.value })
//   }
//   startAdornment="$"
// />
// <TextField
//   inputLabel="STORE CUT"
//   value={getGrossProfit(item) || "-"}
//   displayOnly
// />
// <TextField
//   inputLabel="MARGIN"
//   value={getProfitMargin(item) || "-"}
//   displayOnly
// />
