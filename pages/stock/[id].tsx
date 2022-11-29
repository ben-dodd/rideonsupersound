// Packages
import { useEffect, useState } from 'react'

// DB
import ScreenContainer from 'components/container/screen'
import Tabs from 'components/navigation/tabs'
import { useLogs, useSaleItems } from 'lib/database/read'
import { ModalButton, StockObject } from 'lib/types'

import DiscogsPanel from 'features/inventory/features/api-discogs/components'
import GoogleBooksPanel from 'features/inventory/features/api-google-books/components'
import InventoryItemForm from 'features/inventory/features/item-inventory/components/inventory-item-form'
import StockDetails from 'features/inventory/features/item-inventory/components/stock-details'
import { deleteInventoryItemFromDatabase } from 'lib/database/delete'
import { updateStockItemInDatabase } from 'lib/database/update'
import { parseJSON } from 'lib/utils'
import DeleteIcon from '@mui/icons-material/Delete'
import { useRouter } from 'next/router'
import { useAppStore } from 'lib/store'
import { useStockItem } from 'lib/api/stock'
import PriceDetails from 'features/inventory/features/item-inventory/components/price-details'

export default function InventoryItemScreen() {
  const router = useRouter()
  const { id } = router.query
  const { openConfirm } = useAppStore()
  const { stockItem, isStockItemLoading } = useStockItem(`${id}`)
  const { saleItems } = useSaleItems()
  const { logs, mutateLogs } = useLogs()

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
    openConfirm({
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
                {`This item has already been sold, so can't be deleted. Use CHANGE
                STOCK LEVEL if it's out of stock.`}
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
              // mutateInventory(
              //   inventory?.filter((i) => i?.id !== item?.id),
              //   false
              // )
              router.back()
            }),
    })
  }

  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      onClick: () => router.back(),
      text: 'CLOSE',
    },
    {
      type: 'ok',
      onClick: () => {
        // mutateInventory(
        //   inventory?.map((i) =>
        //     i?.id === stockItem?.id ? { ...stockItem, ...item } : i
        //   ),
        //   false
        // )
        updateStockItemInDatabase(item)
        router.back()
        // setTimeout(() => setItem(null), 1000);
      },
      text: 'SAVE',
    },
  ]

  return (
    // <ScreenContainer
    //   show={Boolean(loadedItemId[page])}
    //   closeFunction={() => {
    //     setLoadedItemId({ ...loadedItemId, [page]: 0 })
    //   }}
    //   title={getItemDisplayName(item)}
    //   loading={isStockItemLoading}
    //   buttons={buttons}
    //   titleClass={titleClass}
    // >
    <div>
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
    </div>
    // </ScreenContainer>
  )
}
