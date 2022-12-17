// Packages
import { useState } from 'react'
import Tabs from 'components/navigation/tabs'
import { ModalButton, StockObject } from 'lib/types'

import DiscogsPanel from 'features/inventory/features/api-discogs/components'
import GoogleBooksPanel from 'features/inventory/features/api-google-books/components'
import InventoryItemForm from 'features/inventory/features/item-stock/components/stock-item-form'
import StockDetails from 'features/inventory/features/item-stock/components/stock-details'
import DeleteIcon from '@mui/icons-material/Delete'
import { useRouter } from 'next/router'
import { useAppStore } from 'lib/store'
import { deleteStockItem, updateStockItem, useStockItem } from 'lib/api/stock'
import PriceDetails from 'features/inventory/features/item-stock/components/price-details'
import Loading from 'components/loading'
import Layout from 'components/layout'

export default function InventoryItemScreen() {
  const router = useRouter()
  const { id } = router.query
  const { openConfirm } = useAppStore()
  const { stockItem, isStockItemLoading } = useStockItem(`${id}`)
  // const { logs, mutateLogs } = useLogs()

  console.log(stockItem)
  const [tab, setTab] = useState(0)

  // // Load
  // useEffect(() => {
  //   setTab[0]
  //   let newItem = { ...stockItem }
  //   // Parse JSON fields
  //   newItem.discogsItem = parseJSON(
  //     newItem?.discogsItem,
  //     newItem?.discogsItem || null
  //   )
  //   newItem.googleBooksItem = parseJSON(
  //     newItem?.googleBooksItem,
  //     newItem?.googleBooksItem || null
  //   )
  //   newItem.genre = parseJSON(newItem?.genre, [newItem?.genre] || null)
  //   setItem(newItem)
  // }, [stockItem])

  // Functions
  function onClickDelete() {
    // REVIEW Delete inventory item
    openConfirm({
      open: true,
      title: 'Are you sure you want to delete this item?',
      styledMessage: (
        <div>
          {stockItem?.saleItemId ? (
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
      yesText: stockItem?.sales?.length > 0 ? 'OK' : "YES, I'M SURE",
      action:
        stockItem?.sales?.length > 0
          ? () => {}
          : async () =>
              deleteStockItem(stockItem?.id)?.then(() => {
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
        updateStockItem(stockItem, stockItem?.id)
        router.back()
      },
      text: 'SAVE',
    },
  ]

  return isStockItemLoading ? (
    <Loading />
  ) : (
    <div>
      <div className="flex flex-col w-full">
        <Tabs
          tabs={
            stockItem?.media === 'Mixed'
              ? ['General Information', 'Discogs', 'GoogleBooks']
              : stockItem?.media === 'Audio'
              ? ['General Information', 'Discogs']
              : stockItem?.media === 'Literature'
              ? ['General Information', 'GoogleBooks']
              : ['General Information']
          }
          value={tab}
          onChange={setTab}
        />
        <div hidden={tab !== 0}>
          <div className="flex">
            <div className="w-1/2">
              <InventoryItemForm />
            </div>
            <div className="w-1/2 ml-4">
              <PriceDetails />
              <StockDetails />
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
              (stockItem?.media === 'Audio' ||
                stockItem?.media === 'Video' ||
                stockItem?.media === 'Mixed')
            )
          }
        >
          {/* <DiscogsPanel item={item} setItem={setItem} /> */}
        </div>
        <div hidden={!(tab === 1 && stockItem?.media === 'Literature')}>
          {/* <GoogleBooksPanel item={item} setItem={setItem} /> */}
        </div>
        <div hidden={tab !== 2}>Item Sale Details</div>
      </div>
    </div>
  )
}

InventoryItemScreen.getLayout = (page) => <Layout>{page}</Layout>