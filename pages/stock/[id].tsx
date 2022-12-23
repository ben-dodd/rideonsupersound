// Packages
import { useState } from 'react'
import Tabs from 'components/navigation/tabs'
import StockDetails from 'features/inventory/features/item-stock/components/stock-details'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useRouter } from 'next/router'
import { useAppStore } from 'lib/store'
import { deleteStockItem, useStockItem } from 'lib/api/stock'
import PriceDetails from 'features/inventory/features/item-stock/components/price-details'
import Loading from 'components/loading'
import Layout from 'components/layout'
import StockItemDisplay from 'features/inventory/features/item-stock/components/stock-display'
import ChangePriceDialog from 'features/inventory/features/item-stock/components/change-price-dialog'
import ChangeStockQuantityDialog from 'features/inventory/features/item-stock/components/change-stock-quantity-dialog'
import StockEditDialog from 'features/inventory/features/item-stock/components/stock-edit-dialog'
import { getItemSkuDisplayName } from 'features/inventory/features/display-inventory/lib/functions'
import { ViewProps } from 'lib/store/types'
import DiscogsPanel from 'features/inventory/features/api-discogs/components'

export default function InventoryItemScreen() {
  const router = useRouter()
  const { id } = router.query
  const { openConfirm, view, openView } = useAppStore()
  const { stockItem, isStockItemLoading } = useStockItem(`${id}`)
  const { item = {}, sales = [] } = stockItem || {}
  const [tab, setTab] = useState(0)

  // Functions
  function onClickDelete() {
    // REVIEW Delete inventory item
    const hasBeenSold = sales?.length > 0
    openConfirm({
      open: true,
      title: 'Are you sure you want to delete this item?',
      styledMessage: (
        <div>
          {hasBeenSold ? (
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
      yesText: hasBeenSold ? 'OK' : "YES, I'M SURE",
      action: hasBeenSold
        ? () => {}
        : async () =>
            deleteStockItem(item?.id)?.then(() => {
              router.back()
            }),
    })
  }

  return isStockItemLoading ? (
    <Loading />
  ) : (
    <>
      <div>
        <div className="flex w-full bg-red-400 justify-between p-2 h-nav border-b drop-shadow-md">
          <div className="text-2xl font-bold">{`STOCK ${getItemSkuDisplayName(
            item
          )}`}</div>
          <div className="flex">
            <button
              className="p-1 border border-black bg-red-300 hover:bg-tertiary rounded-xl"
              onClick={() => openView(ViewProps.stockEditDialog)}
            >
              <EditIcon />
              Edit
            </button>
            <button
              className="p-1 border border-black bg-white hover:bg-tertiary rounded-xl"
              onClick={() => openView(ViewProps.changePriceDialog)}
            >
              <DeleteIcon />
              Change Price{' '}
            </button>
            <button
              className="p-1 border border-black bg-white hover:bg-tertiary rounded-xl"
              onClick={() => openView(ViewProps.changeStockQuantityDialog)}
            >
              <DeleteIcon />
              Change Quantities
            </button>
            <button
              className="p-1 border border-black bg-white hover:bg-tertiary rounded-xl"
              onClick={onClickDelete}
            >
              <DeleteIcon />
              Delete Item
            </button>
          </div>
        </div>
        <div className="flex flex-col w-full h-inventory overflow-y-scroll">
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
              <div className="w-1/3">
                <StockItemDisplay />
              </div>
              <div className="w-2/3 ml-4">
                <PriceDetails />
                <StockDetails />
              </div>
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
            <DiscogsPanel />
          </div>
          <div hidden={!(tab === 1 && item?.media === 'Literature')}>
            {/* <GoogleBooksPanel item={item} setItem={setItem} /> */}
          </div>
          <div hidden={tab !== 2}>Item Sale Details</div>
        </div>
      </div>
      {view?.changePriceDialog && <ChangePriceDialog />}
      {view?.changeStockQuantityDialog && <ChangeStockQuantityDialog />}
      {view?.stockEditDialog && <StockEditDialog />}
    </>
  )
}

InventoryItemScreen.getLayout = (page) => <Layout>{page}</Layout>
