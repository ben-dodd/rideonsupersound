import { getImageSrc, getItemSku } from 'lib/functions/displayInventory'
import { useVendors } from 'lib/api/vendor'
import InfoBox from 'components/container/info-box'
import { VendorObject } from 'lib/types/vendor'

export default function StockItemDisplay({ stockItem, onImageUpload }) {
  // TODO fix up stock item type so it can be used here
  const { item = {} } = stockItem || {}
  const { vendors } = useVendors()

  return (
    <div>
      <InfoBox
        image={getImageSrc(item)}
        data={[
          { label: 'SKU', value: getItemSku(item), alwaysDisplay: true },
          { label: 'Artist', value: item?.artist, alwaysDisplay: true },
          { label: 'Title', value: item?.title, alwaysDisplay: true },
          {
            label: 'Vendor',
            value: `[${item?.vendorId}] ${
              vendors?.filter?.((v: VendorObject) => v?.id === item?.vendorId)?.[0]?.name || ''
            }`,
            link: `/vendors/${item?.vendorId}`,
            alwaysDisplay: true,
          },
          { label: 'Barcode', value: item?.barcode },
          { label: 'Format', value: item?.format },
          { label: 'Colour', value: item?.colour },
          { label: 'Size', value: item?.size },
          {
            label: 'Condition',
            value: item?.isNew ? 'New' : `Used (${item?.cond || 'Condition Not Set'})`,
          },
          { label: 'Section', value: item?.section },
          { label: 'Country', value: item?.country },
          { label: 'Genre/Tags', value: item?.genre?.join?.(', ') },
          { label: 'Description/Notes', value: item?.description },
          { label: 'Reorder item from vendor', value: Boolean(item?.doReorder), alwaysDisplay: true },
          { label: 'Listed on website', value: Boolean(item?.doListOnWebsite), alwaysDisplay: true },
          { label: 'Item has no quantity', value: Boolean(item?.hasNoQuantity) },
        ]}
        imageIsClickable
        onImageUpload={onImageUpload}
      />
    </div>
  )
}
