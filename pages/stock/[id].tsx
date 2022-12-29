// Packages
import { useState } from 'react'
import Tabs from 'components/navigation/tabs'
import StockDetails from 'features/inventory/item-stock/stock-details'
import { Settings, Edit, Delete } from '@mui/icons-material'
import { useRouter } from 'next/router'
import { useAppStore } from 'lib/store'
import { deleteStockItem, useStockItem } from 'lib/api/stock'
import PriceDetails from 'features/inventory/item-stock/price-details'
import Loading from 'components/loading'
import Layout from 'components/layout'
import StockItemDisplay from 'features/inventory/item-stock/stock-display'
import ChangePriceDialog from 'features/inventory/item-stock/change-price-dialog'
import ChangeStockQuantityDialog from 'features/inventory/item-stock/change-stock-quantity-dialog'
import StockEditDialog from 'features/inventory/item-stock/stock-edit-dialog'
import { getItemSkuDisplayName } from 'lib/functions/displayInventory'
import { ViewProps } from 'lib/store/types'
import DiscogsPanel from 'features/inventory/api-discogs'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

export default function InventoryItemScreen() {
  const router = useRouter()
  const { id } = router.query
  const { openConfirm, view, openView } = useAppStore()
  const { stockItem, isStockItemLoading } = useStockItem(`${id}`)
  const { item = {}, sales = [] } = stockItem || {}
  const [tab, setTab] = useState(0)
  const [menuVisible, setMenuVisible] = useState(false)

  const toggleMenu = () => setMenuVisible((isVisible) => !isVisible)

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

  const Menu = () => (
    <div className="absolute top-7 right-7 bg-white shadow-2xl rounded-lg py-4 px-6 z-5">
      <div className="block mb-2 text-gray-700 hover:text-gray-900">
        <button
          className="flex"
          onClick={() => openView(ViewProps.stockEditDialog)}
        >
          <Edit />
          Edit
        </button>
      </div>
      <div className="block mb-2 text-gray-700 hover:text-gray-900">
        <button
          className="flex"
          onClick={() => openView(ViewProps.changePriceDialog)}
        >
          <Delete />
          Change Price{' '}
        </button>
      </div>
      <div className="block mb-2 text-gray-700 hover:text-gray-900">
        <button
          className="flex"
          onClick={() => openView(ViewProps.changeStockQuantityDialog)}
        >
          <Delete />
          Change Quantities
        </button>
      </div>
      <div className="block mb-2 text-gray-700 hover:text-gray-900">
        <button className="flex" onClick={onClickDelete}>
          <Delete />
          Delete Item
        </button>
      </div>
    </div>
  )

  return isStockItemLoading ? (
    <Loading />
  ) : (
    <>
      <div>
        <div className="flex w-full bg-red-400 justify-between p-2 h-nav border-b drop-shadow-md">
          <div className="text-2xl font-bold">{`STOCK ${getItemSkuDisplayName(
            item
          )}`}</div>
          <div>
            {menuVisible && <Menu />}
            <button onClick={toggleMenu}>
              <Settings />
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

export const getServerSideProps = withPageAuthRequired()
