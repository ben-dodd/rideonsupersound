import { Delete, Edit, Settings } from '@mui/icons-material'
import DropdownMenu from 'components/dropdown-menu'
import Tabs from 'components/navigation/tabs'
import { deleteStockItem } from 'lib/api/stock'
import { getItemSkuDisplayName } from 'lib/functions/displayInventory'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useRouter } from 'next/router'
import { useState } from 'react'
import DiscogsPanel from '../api-discogs'
import PriceDetails from './price-details'
import SalesDetails from './sales-details'
import StockDetails from './stock-details'
import StockItemDisplay from './stock-display'

const StockItemScreen = ({ item, sales }) => {
  const { openConfirm, openView } = useAppStore()
  const [tab, setTab] = useState(0)
  const [menuVisible, setMenuVisible] = useState(false)
  const router = useRouter()

  const toggleMenu = () => setMenuVisible((isVisible) => !isVisible)

  function onClickDelete() {
    // REVIEW Delete inventory item
    const hasBeenSold = sales?.length > 0
    openConfirm({
      open: true,
      title: hasBeenSold ? 'Sorry' : 'Are you sure you want to delete this item?',
      message: hasBeenSold
        ? `This item has already been sold, so can't be deleted. Use CHANGE
                STOCK LEVEL if it's out of stock.`
        : 'This will delete the item from the stock list.',
      yesText: hasBeenSold ? 'OK' : "YES, I'M SURE",
      yesButtonOnly: hasBeenSold,
      action: hasBeenSold
        ? () => {}
        : async () =>
            deleteStockItem(item?.id)?.then(() => {
              router.back()
            }),
    })
  }

  const menuItems = [
    { text: 'Edit', icon: <Edit />, onClick: () => openView(ViewProps.stockEditDialog) },
    { text: 'Change Price', icon: <Delete />, onClick: () => openView(ViewProps.changePriceDialog) },
    { text: 'Change Quantities', icon: <Delete />, onClick: () => openView(ViewProps.changeStockQuantityDialog) },
    { text: 'Delete Item', icon: <Delete />, onClick: onClickDelete },
  ]

  return (
    <div>
      <div className="flex w-full bg-brown-dark text-white justify-between p-2 h-nav">
        <div className="text-2xl font-bold">{`STOCK ${getItemSkuDisplayName(item)}`}</div>
        <div>
          <DropdownMenu items={menuItems} open={menuVisible} setOpen={setMenuVisible} />
          <button onClick={toggleMenu}>
            <Settings />
          </button>
        </div>
      </div>
      <div className="flex flex-col w-full h-content overflow-y-scroll px-2 pt-2">
        <Tabs
          tabs={
            item?.media === 'Mixed'
              ? ['General Information', 'Sales', 'Discogs', 'GoogleBooks']
              : item?.media === 'Audio'
              ? ['General Information', 'Sales', 'Discogs']
              : item?.media === 'Literature'
              ? ['General Information', 'Sales', 'GoogleBooks']
              : ['General Information', 'Sales']
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
        <div hidden={!(tab === 2 && (item?.media === 'Audio' || item?.media === 'Video' || item?.media === 'Mixed'))}>
          <DiscogsPanel />
        </div>
        <div hidden={!(tab === 2 && item?.media === 'Literature')}>{/* <GoogleBooksPanel /> */}</div>
        <div hidden={tab !== 1}>
          <SalesDetails sales={sales} />
        </div>
      </div>
    </div>
  )
}

export default StockItemScreen
