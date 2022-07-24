// Packages
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'

// DB
import { clerkAtom, confirmModalAtom, loadedItemIdAtom } from 'lib/atoms'
import {
  useInventory,
  useLogs,
  useSaleItems,
  useStockItem,
} from 'lib/swr-hooks'
import { ModalButton, StockObject } from 'lib/types'

// Functions
import {
  getItemDisplayName,
  getItemSkuDisplayNameById,
} from 'lib/data-functions'
import {
  deleteInventoryItemFromDatabase,
  saveLog,
  updateStockItemInDatabase,
} from 'lib/db-functions'

// Components
import ScreenContainer from '@/components/container/screen'
import Tabs from '@/components/navigation/tabs'

import DiscogsPanel from '@/features/api-discogs/components'
import StockDetails from '@/features/item-inventory/components/stock-details'
import DeleteIcon from '@mui/icons-material/Delete'
import GoogleBooksPanel from 'features/api-google-books/components'
import InventoryItemForm from 'features/item-inventory/components/inventory-item-form'
import { parseJSON } from 'lib/utils'
import PriceDetails from './price-details'

export default function InventoryItemScreen({ page }) {
  // Atoms
  const [loadedItemId, setLoadedItemId] = useAtom(loadedItemIdAtom)
  const [, setConfirmModal] = useAtom(confirmModalAtom)

  // SWR
  const { stockItem, isStockItemLoading } = useStockItem(loadedItemId[page])
  const { inventory, mutateInventory } = useInventory()
  const { saleItems } = useSaleItems()
  const { logs, mutateLogs } = useLogs()
  const [clerk] = useAtom(clerkAtom)

  // State
  const [item, setItem]: [StockObject, Function] = useState(null)
  const [tab, setTab] = useState(0)

  // Load
  useEffect(() => {
    setTab[0]
    let newItem = { ...stockItem }
    // Parse JSON fields
    newItem.discogsItem = parseJSON(
      newItem?.discogsItem,
      newItem?.discogsItem || null
    )
    newItem.googleBooksItem = parseJSON(
      newItem?.googleBooksItem,
      newItem?.googleBooksItem || null
    )
    newItem.genre = parseJSON(newItem?.genre, [newItem?.genre] || null)
    setItem(newItem)
  }, [stockItem])

  const itemIsPartOfSale =
    saleItems?.filter((s) => s?.item_id === item?.id)?.length > 0

  // Functions
  function onClickDelete() {
    // REVIEW Delete inventory item
    setConfirmModal({
      open: true,
      title: 'Are you sure you want to delete this item?',
      styledMessage: (
        <div>
          {itemIsPartOfSale ? (
            <>
              <div className="text-red-500 text-lg text-center p-2 border-red-500">
                SORRY
              </div>
              <div>
                This item has already been sold, so can't be deleted. Use CHANGE
                STOCK LEVEL if it's out of stock.
              </div>
            </>
          ) : (
            <div>This will delete the item from the stock list.</div>
          )}
        </div>
      ),
      yesText: itemIsPartOfSale ? 'OK' : "YES, I'M SURE",
      action: itemIsPartOfSale
        ? () => {}
        : async () =>
            deleteInventoryItemFromDatabase(item?.id)?.then(() => {
              mutateInventory(
                inventory?.filter((i) => i?.id !== item?.id),
                false
              )
              saveLog(
                {
                  log: `${getItemSkuDisplayNameById(
                    item?.id,
                    inventory
                  )} deleted.`,
                  clerk_id: clerk?.id,
                  table_id: 'stock',
                  row_id: item?.id,
                },
                logs,
                mutateLogs
              )
              setLoadedItemId({ ...loadedItemId, [page]: 0 })
            }),
    })
  }

  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      onClick: () => setLoadedItemId({ ...loadedItemId, [page]: 0 }),
      text: 'CLOSE',
    },
    {
      type: 'ok',
      onClick: () => {
        mutateInventory(
          inventory?.map((i) =>
            i?.id === stockItem?.id ? { ...stockItem, ...item } : i
          ),
          false
        )
        updateStockItemInDatabase(item)
        setLoadedItemId({ ...loadedItemId, [page]: 0 })
        setItem(null)
        // setTimeout(() => setItem(null), 1000);
      },
      text: 'SAVE',
    },
  ]

  const titleClass = page === 'sell' ? 'bg-col1' : 'bg-col2'

  return (
    <ScreenContainer
      show={Boolean(loadedItemId[page])}
      closeFunction={() => {
        setLoadedItemId({ ...loadedItemId, [page]: 0 })
      }}
      title={getItemDisplayName(item)}
      loading={isStockItemLoading}
      buttons={buttons}
      titleClass={titleClass}
    >
      <div className="flex flex-col w-full">
        <Tabs
          tabs={
            item?.media === 'Mixed'
              ? ['General Information', 'Discogs', 'GoogleBooks']
              : item?.media === 'Audio'
              ? ['General Information', 'Discogs']
              : item?.media === 'Literature'
              ? ['General Information', 'GoogleBooks']
              : ['General Information']
          }
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
          <div className="flex justify-start py-2">
            <button
              className="p-1 border border-black hover:bg-tertiary rounded-xl mt-2"
              onClick={onClickDelete}
            >
              <DeleteIcon />
              Delete Item
            </button>
          </div>
        </div>
        <div
          hidden={
            !(
              tab === 1 &&
              (item?.media === 'Audio' ||
                item?.media === 'Video' ||
                item?.media === 'Mixed')
            )
          }
        >
          <DiscogsPanel item={item} setItem={setItem} />
        </div>
        <div hidden={!(tab === 1 && item?.media === 'Literature')}>
          <GoogleBooksPanel item={item} setItem={setItem} />
        </div>
        <div hidden={tab !== 2}>Item Sale Details</div>
      </div>
    </ScreenContainer>
  )
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
