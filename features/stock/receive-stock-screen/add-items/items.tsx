import { getItemDisplayName, getItemSkuDisplayName } from 'lib/functions/displayInventory'
import CloseIcon from '@mui/icons-material/Close'
import { useAppStore } from 'lib/store'
import SectionPanel from 'components/container/section-panel'
import { ShoppingBasket } from '@mui/icons-material'

export default function Items() {
  const { batchReceiveSession, setBatchReceiveSession } = useAppStore()
  const removeItem = (removeItem) => {
    const batchList = batchReceiveSession?.batchList?.filter((item) => item?.key !== removeItem?.key)
    setBatchReceiveSession({ batchList })
  }
  return (
    <SectionPanel title="Receive Basket" icon={<ShoppingBasket />}>
      {batchReceiveSession?.batchList?.length > 0 ? (
        batchReceiveSession?.batchList?.map((batchItem: any) => {
          return (
            <div key={batchItem?.key} className="flex hover:bg-gray-200 items-center p-2 border-b">
              <button className="p-2" onClick={() => removeItem(batchItem)}>
                <CloseIcon />
              </button>
              {batchItem?.item?.id ? getItemSkuDisplayName(batchItem?.item) : getItemDisplayName(batchItem?.item)}
            </div>
          )
        })
      ) : (
        <div>No items added.</div>
      )}
    </SectionPanel>
  )
}
