import { getImageSrc, getItemSku } from 'lib/functions/displayInventory'
import { useVendors } from 'lib/api/vendor'
import router from 'next/router'
import { useStockItem } from 'lib/api/stock'
import InfoBox from 'components/infoBox'
import { VendorObject } from 'lib/types/vendor'

export default function StockItemDisplay() {
  const { id } = router.query
  const { stockItem, isStockItemLoading } = useStockItem(`${id}`)
  // TODO fix up stock item type so it can be used here
  const { item = {} } = stockItem || {}
  const { vendors } = useVendors()
  // TODO fix up display so it looks nice

  return (
    <div>
      <InfoBox
        image={getImageSrc(item)}
        data={[
          { label: 'SKU', value: getItemSku(item) },
          { label: 'Artist', value: item?.artist },
          { label: 'Title', value: item?.title },
          {
            label: 'Vendor',
            value: `[${item?.vendorId}] ${
              vendors?.filter((v: VendorObject) => v?.id === item?.vendorId)?.[0]?.name || ''
            }`,
            link: `/vendors/${item?.vendorId}`,
          },
          { label: 'Barcode', value: item?.barcode },
          { label: 'Format', value: item?.format },
          { label: 'Colour', value: item?.colour },
          { label: 'Size', value: item?.size },
          {
            label: 'Condition',
            value: item?.isNew ? 'New' : `Used (${item?.cond})`,
          },
          { label: 'Section', value: item?.section },
          { label: 'Country', value: item?.country },
          { label: 'Genre/Tags', value: item?.genre?.join?.(', ') },
          { label: 'Description/Notes', value: item?.description },
          { label: 'Listed on Website', value: Boolean(item?.doListOnWebsite) },
          { label: 'No-Quantity Item', value: Boolean(item?.hasNoQuantity) },
        ]}
      />
    </div>
  )
}
