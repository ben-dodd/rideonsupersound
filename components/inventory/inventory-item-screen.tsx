import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import { viewAtom, clerkAtom, loadedItemIdAtom, pageAtom } from "@/lib/atoms";
import { useVendors, useStockItem, useInventory } from "@/lib/swr-hooks";
import { VendorObject, InventoryObject, ModalButton } from "@/lib/types";
import {
  getItemDisplayName,
  getGrossProfit,
  getProfitMargin,
  getImageSrc,
  getItemSku,
} from "@/lib/data-functions";
import { updateStockItemInDatabase } from "@/lib/db-functions";

import TextField from "@/components/inputs/text-field";
import SettingsSelect from "@/components/inputs/settings-select";
import RadioButton from "@/components/inputs/radio-button";
import DiscogsPanel from "./discogs-panel";
import GoogleBooksPanel from "./google-books-panel";

import ScreenContainer from "@/components/container/screen";

export default function InventoryItemScreen({ page }) {
  const [loadedItemId, setLoadedItemId] = useAtom(loadedItemIdAtom);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [item, setItem]: [InventoryObject, Function] = useState(null);
  // const newItem = Boolean(item?.newItem);
  // const onClose = item?.onClose;
  const { stockItem, isStockItemLoading } = useStockItem(loadedItemId[page]);
  const { mutateInventory } = useInventory();
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
  const syncInfo = Boolean(
    item?.media === "Audio" || item?.media === "Literature"
  );
  const { vendors } = useVendors();
  const [clerk] = useAtom(clerkAtom);
  // console.log(item);

  useEffect(() => {
    fetch(`https://api.exchangeratesapi.io/latest?symbols=USD,NZD`).then(
      (results) => {
        results.json().then((json) => {
          if (json.rates) {
            // console.log(json.rates.NZD / json.rates.USD);
            setExchangeRate(json.rates.NZD / json.rates.USD);
          }
        });
      }
    );
  }, []);

  const vendor = useMemo(
    () =>
      (vendors &&
        vendors.filter(
          (vendor: VendorObject) => vendor?.id === item?.vendor_id
        )[0]) ||
      null,
    [item]
  );

  function onClickDelete() {
    // Delete inventory item
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
        updateStockItemInDatabase(item);
        setLoadedItemId({ ...loadedItemId, [page]: 0 });
        setItem(null);
        // setTimeout(() => setItem(null), 1000);
        mutateInventory();
      },
      text: "SAVE",
    },
  ];

  return (
    <ScreenContainer
      show={Boolean(loadedItemId[page])}
      closeFunction={() => {
        setLoadedItemId({ ...loadedItemId, [page]: 0 });
      }}
      title={getItemDisplayName(item)}
      loading={isStockItemLoading}
      buttons={buttons}
    >
      <>
        <div className={`p-6 ${syncInfo ? "w-6/12" : "w-full"}`}>
          <div className="flex justify-start w-full">
            <div className="pr-2 w-52 mr-2">
              <div className="w-52 h-52 relative">
                <Image
                  layout="fill"
                  objectFit="contain"
                  src={getImageSrc(item)}
                  alt={item?.title || "Inventory image"}
                />
                <div className="absolute w-52 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center">
                  {getItemSku(item)}
                </div>
              </div>
            </div>
            {/*<div className="pr-2 w-1/2">
                  <Image
                    width={32}
                    height={32}
                    src={
                      item?.image_url ||
                      `${process.env.NEXT_PUBLIC_RESOURCE_URL}img/default.png`
                    }
                    alt={item?.title || "Inventory image"}
                  />
                </div>*/}
            <div className="w-full">
              <TextField
                value={item?.artist || ""}
                onChange={(e: any) =>
                  setItem({ ...item, artist: e.target.value })
                }
                inputLabel="ARTIST"
              />
              <TextField
                value={item?.title || ""}
                onChange={(e: any) =>
                  setItem({ ...item, title: e.target.value })
                }
                inputLabel="TITLE"
              />
              <TextField
                value={item?.display_as || getItemDisplayName(item)}
                onChange={(e: any) =>
                  setItem({ ...item, display_as: e.target.value })
                }
                inputLabel="DISPLAY NAME"
              />
              <div className="font-bold text-sm">{`Selling for ${vendor?.name}`}</div>
            </div>
          </div>
          <div className="grid grid-cols-4 justify-items-start rounded border p-2 mt-2">
            <div className="stock-indicator__container">IN STOCK</div>
            <div
              className={`stock-indicator__number ${
                item?.quantity <= 0 ? "bg-tertiary-light" : "bg-primary-light"
              }`}
            >
              {item?.quantity || 0}
            </div>
            <div className="stock-indicator__container">RECEIVED</div>
            <div className="stock-indicator__number bg-secondary-light">
              {item?.quantity_received || 0}
            </div>
            <div className="stock-indicator__container">SOLD</div>
            <div className="stock-indicator__number bg-secondary-light">
              {Math.abs(item?.quantity_sold || 0)}
            </div>
            <div className="stock-indicator__container">RETURNED</div>
            <div className="stock-indicator__number bg-secondary-light">
              {Math.abs(item?.quantity_returned || 0)}
            </div>
            <div className="stock-indicator__container">LAYBY/HOLD</div>
            <div className="stock-indicator__number bg-secondary-light">
              {(item?.quantity_layby +
                item?.quantity_hold +
                item?.quantity_unlayby +
                item?.quantity_unhold) *
                -1}
            </div>
            <div className="stock-indicator__container">DISCARD/LOST</div>
            <div className="stock-indicator__number bg-secondary-light">
              {(item?.quantity_discarded +
                item?.quantity_lost +
                item?.quantity_found) *
                -1}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            <TextField
              inputClass="font-bold"
              inputLabel="SELL PRICE"
              value={`${(item?.total_sell / 100)?.toFixed(2)}` || ""}
              onChange={(e: any) =>
                setItem({ ...item, total_sell: e.target.value })
              }
              startAdornment="$"
            />
            <TextField
              inputLabel="COST PRICE"
              value={`${(item?.vendor_cut / 100)?.toFixed(2)}` || ""}
              onChange={(e: any) =>
                setItem({ ...item, vendor_cut: e.target.value })
              }
              startAdornment="$"
            />
            <TextField
              inputLabel="STORE CUT"
              value={getGrossProfit(item) || "-"}
              displayOnly
            />
            <TextField
              inputLabel="MARGIN"
              value={getProfitMargin(item) || "-"}
              displayOnly
            />
          </div>
          <TextField
            inputLabel="BARCODE"
            value={item?.barcode || ""}
            onChange={(e: any) => setItem({ ...item, barcode: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2 mb-2">
            <SettingsSelect
              object={item}
              onEdit={setItem}
              inputLabel="TYPE"
              dbField="media"
              isCreateDisabled={true}
            />
            <SettingsSelect
              object={item}
              onEdit={setItem}
              inputLabel="FORMAT"
              dbField="format"
            />
          </div>
          {item?.format == "Shirt" ? (
            <div className="grid grid-cols-2 gap-2 mb-2">
              <SettingsSelect
                object={item}
                onEdit={setItem}
                inputLabel="COLOUR"
                dbField="colour"
              />
              <SettingsSelect
                object={item}
                onEdit={setItem}
                inputLabel="SIZE"
                dbField="size"
              />
            </div>
          ) : (
            <div className="flex items-end">
              <RadioButton
                inputLabel="CONDITION"
                group="isNew"
                value={Boolean(item?.is_new)}
                onChange={(value: any) => setItem({ ...item, is_new: value })}
                options={[
                  { id: "new", value: true, label: "New" },
                  { id: "used", value: false, label: "Used" },
                ]}
              />
              <SettingsSelect
                className="w-full"
                object={item}
                onEdit={setItem}
                dbField="cond"
                isCreateDisabled={true}
              />
            </div>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <SettingsSelect
              object={item}
              onEdit={setItem}
              inputLabel="COUNTRY"
              dbField="country"
            />
            <SettingsSelect
              object={item}
              onEdit={setItem}
              inputLabel="GENRE"
              dbField="genre"
            />
          </div>
          <SettingsSelect
            object={item}
            onEdit={setItem}
            isMulti
            inputLabel="TAGS"
            dbField="tag"
          />
          <TextField
            inputLabel="DESCRIPTION"
            value={item?.description || ""}
            onChange={(e: any) =>
              setItem({ ...item, description: e.target.value })
            }
            multiline
          />
          <TextField
            inputLabel="NOTES"
            value={item?.note || ""}
            onChange={(e: any) => setItem({ ...item, note: e.target.value })}
            multiline
          />
          {/*}<SalesStats item={item} />*/}
          <div className="flex justify-end">
            <button
              className="p-1 border border-black hover:bg-tertiary rounded-xl mt-2"
              onClick={onClickDelete}
            >
              Delete Item
            </button>
          </div>
        </div>
        {syncInfo && (
          <div className="bg-gray-100 p8 border w-6/12">
            {(item?.media === "Audio" ||
              item?.media === "Video" ||
              item?.media === "Mixed") && (
              <DiscogsPanel
                item={item}
                setItem={setItem}
                exchangeRate={exchangeRate}
              />
            )}
            {item?.media === "Literature" && (
              <GoogleBooksPanel item={item} setItem={setItem} />
            )}
          </div>
        )}
      </>
    </ScreenContainer>
  );
}

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
