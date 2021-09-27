import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import { itemScreenAtom, clerkAtom } from "@/lib/atoms";
import { useVendors } from "@/lib/swr-hooks";
import { VendorObject } from "@/lib/types";
import {
  writeInventoryDisplayName,
  getGrossProfit,
  getProfitMargin,
} from "@/lib/data-functions";

import TextField from "@/components/inputs/text-field";

import CloseIcon from "@material-ui/icons/Close";

export default function ItemScreen() {
  const [item, setItem] = useAtom(itemScreenAtom);
  const [exchangeRate, setExchangeRate] = useState(1);
  const syncInfo = Boolean(
    item?.media === "Audio" || item?.media === "Literature"
  );
  // const newItem = Boolean(item?.newItem);
  // const onClose = item?.onClose;
  const { vendors } = useVendors();
  const [clerk] = useAtom(clerkAtom);
  const conditionOptions = [
    "Mint (M)",
    "Near Mint (NM or M-)",
    "Very Good Plus (VG+)",
    "Very Good (VG)",
    "Good Plus (G+)",
    "Good (G)",
    "Fair (F)",
    "Poor (P)",
  ];

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

  return (
    <div className="bg-white text-black">
      <div className="dialog__title--has-actions">
        {writeInventoryDisplayName(item)}
        <button
          className="icon-button-small-black"
          onClick={() => setItem(null)}
        >
          <CloseIcon />
        </button>
      </div>
      <div className="flex items-start overflow-y-scroll">
        <div className={`p-6 ${syncInfo ? "w-6/12" : "w-full"}`}>
          <div className="flex justify-start w-full">
            <div className="pr-2 w-1/2">
              <Image
                width={32}
                height={32}
                src={
                  item?.image_url ||
                  `${process.env.NEXT_PUBLIC_RESOURCE_URL}img/default.png`
                }
                alt={item?.title || "Inventory image"}
              />
            </div>
            <div className="w-1/2">
              <TextField
                value={vendor?.name || ""}
                inputLabel="VENDOR"
                displayOnly
              />
              <TextField
                value={item?.artist || ""}
                onChange={(e) => setItem({ ...item, artist: e.target.value })}
                inputLabel="ARTIST"
              />
              <TextField
                value={item?.title || ""}
                onChange={(e) => setItem({ ...item, title: e.target.value })}
                inputLabel="TITLE"
              />
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
            <div />
            <div />
            <div className="stock-indicator__container">RECEIVED</div>
            <div className="stock-indicator__number bg-secondary-light">
              {item?.quantity_received || 0}
            </div>
            <div className="stock-indicator__container">SOLD</div>
            <div className="stock-indicator__number bg-secondary-light">
              {item?.quantity_sold || 0}
            </div>
            <div className="stock-indicator__container">RETURNED</div>
            <div className="stock-indicator__number bg-secondary-light">
              {item?.quantity_returned || 0}
            </div>
            <div className="stock-indicator__container">LAYBY/HOLD</div>
            <div className="stock-indicator__number bg-secondary-light">
              {item?.quantity_layby +
                item?.quantity_hold -
                item?.quantity_unlayby -
                item?.quantity_unhold}
            </div>
            <div className="stock-indicator__container">DISCARD/LOST</div>
            <div className="stock-indicator__number bg-secondary-light">
              {item?.quantity_discarded + item?.quantity_lost}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <TextField
              inputLabel="COST PRICE"
              value={`${item?.vendor_cut}` || ""}
              onChange={(e) => setItem({ ...item, vendor_cut: e.target.value })}
              startAdornment="$"
            />
            <TextField
              inputLabel="SELL PRICE"
              value={`${item?.total_sell}` || ""}
              onChange={(e) => setItem({ ...item, total_sell: e.target.value })}
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
            onChange={(e) => setItem({ ...item, barcode: e.target.value })}
          />
        </div>
      </div>
      {/*<div className="grid grid-cols-2 gap-2 mb-2">
            <SettingsSelect
              object={item}
              onEdit={setItem}
              inputLabel="TYPE"
              dbField="type"
              optionsLabel="typeOptions"
            />
            <SettingsSelect
              object={item}
              onEdit={setItem}
              inputLabel="FORMAT"
              dbField="format"
              optionsLabel="formatOptions"
            />
          </div>
          {get(item, "format") == "Shirt" ? (
            <div className="grid grid-cols-2 gap-2 mb-2">
              <SettingsSelect
                object={item}
                onEdit={setItem}
                inputLabel="COLOUR"
                dbField="colour"
                optionsLabel="colourOptions"
              />
              <SettingsSelect
                object={item}
                onEdit={setItem}
                inputLabel="SIZE"
                dbField="size"
                optionsLabel="sizeOptions"
              />
            </div>
          ) : (
            <div className="flex items-end">
              <RadioButton
                inputLabel="CONDITION"
                group="isNew"
                value={get(item, "isNew", false)}
                onChange={(value) => setItem({ ...item, isNew: value })}
                options={[
                  { id: "new", value: true, label: "New" },
                  { id: "used", value: false, label: "Used" },
                ]}
              />
              <Select
                placeholder="Select condition..."
                isClearable
                className="w-full"
                value={{
                  value: get(item, "condition", null),
                  label: get(item, "condition", null),
                }}
                options={conditionOptions.map((item) => ({
                  value: item,
                  label: item,
                }))}
                onChange={(opt) => {
                  setItem({ ...item, condition: opt.value });
                }}
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
              optionsLabel="countryOptions"
            />
            <SettingsSelect
              object={item}
              onEdit={setItem}
              inputLabel="GENRE"
              dbField="genre"
              optionsLabel="genreOptions"
            />
          </div>
          <SettingsSelect
            object={item}
            onEdit={setItem}
            isMulti
            inputLabel="TAGS"
            dbField="tags"
            optionsLabel="tagOptions"
          />
          <TextField
            inputLabel="DESCRIPTION"
            value={get(item, "description", "")}
            onChange={(e) => setItem({ ...item, description: e.target.value })}
            multiline
          />
          <TextField
            inputLabel="NOTES"
            value={get(item, "notes", "")}
            onChange={(e) => setItem({ ...item, notes: e.target.value })}
            multiline
          />
          <SalesStats item={item} />
          <div className="flex justify-end">
            <button
              className="p-1 border border-black hover:bg-tertiary rounded-xl mt-2"
              onClick={() =>
                deleteItem({
                  dispatch,
                  collection: "inventory",
                  item,
                  genericName: "Inventory Item",
                  itemName: writeInventoryDisplayName(item),
                })
              }
            >
              Delete Item
            </button>
          </div>
        </div>
        {syncInfo && (
          <div className="bg-gray-100 p8 border w-6/12">
            {(get(item, "type") === "Audio" ||
              get(item, "type") === "Video" ||
              get(item, "type") === "Mixed") && (
              <DiscogsPanel
                item={item}
                setItem={setItem}
                exchangeRate={exchangeRate}
              />
            )}
            {get(item, "type") === "Literature" && (
              <GoogleBooksPanel
                item={item}
                setItem={setItem}
                exchangeRate={exchangeRate}
              />
            )}
          </div>
        )}
      </div>*/}
      <div className="dialog__footer--actions-right">
        <div />
        <button
          className="dialog__footer-buttons--cancel"
          onClick={() => {
            setItem({ id: null, vendor_id: null });
          }}
        >
          CLOSE
        </button>
        <button className="dialog__footer-buttons--ok" onClick={null}>
          SAVE
        </button>
      </div>
    </div>
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
