import Tabs from '@components/navigation/tabs'
import DiscogsPanel from '@features/inventory/features/api-discogs/components'
import GoogleBooksPanel from '@features/inventory/features/api-google-books/components'
import InventoryItemForm from '@features/inventory/features/item-inventory/components/inventory-item-form'
import { receiveStockAtom } from '@lib/atoms'
import { useAtom } from 'jotai'
import { useState } from 'react'
import Items from './items'

export default function CheckDetails() {
  const [basket, setBasket] = useAtom(receiveStockAtom)
  const [item, setItem] = useState(
    basket?.items ? basket?.items[0]?.item : null
  )
  const [itemKey, setItemKey] = useState(
    basket?.items ? basket?.items[0]?.key : null
  )
  const [mode, setMode] = useState(0)
  const onItemClick = (newItem) => {
    if (item) {
      const items = basket?.items?.map((i) => {
        if (i?.key === itemKey) return { ...i, item }
        else return i
      })
      setBasket({ ...basket, items })
    }
    setItem(newItem?.item)
    setItemKey(newItem?.key)
  }
  const setItemAndBasket = (item) => {
    setItem(item)
    const items = basket?.items?.map((i) => {
      if (i?.key === itemKey) return { ...i, item }
      else return i
    })
    setBasket({ ...basket, items })
  }
  return (
    <div className="w-full">
      <Tabs
        tabs={[
          'General Details',
          item?.media === 'Audio'
            ? 'Discogs'
            : item?.media === 'Literature'
            ? 'GoogleBooks'
            : null,
        ]}
        value={mode}
        onChange={setMode}
      />
      <div className="flex w-full">
        <div className="w-3/5 mr-4">
          {item?.id && (
            <div className="bg-red-500 p-2 mb-2 text-white">
              Item already in stock. Editing disabled.
            </div>
          )}
          <div hidden={mode !== 0}>
            <InventoryItemForm
              item={item}
              setItem={setItemAndBasket}
              disabled={item?.id}
            />
          </div>
          <div hidden={!(mode === 1 && item?.media === 'Audio')}>
            <DiscogsPanel
              item={item}
              setItem={setItemAndBasket}
              disabled={item?.id}
            />
          </div>
          <div hidden={!(mode === 1 && item?.media === 'Literature')}>
            <GoogleBooksPanel
              item={item}
              setItem={setItemAndBasket}
              disabled={item?.id}
            />
          </div>
        </div>
        <div className="w-2/5">
          <Items onClick={onItemClick} />
        </div>
      </div>
    </div>
  )
}
