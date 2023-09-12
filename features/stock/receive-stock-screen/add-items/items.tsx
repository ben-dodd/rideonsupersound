import { getItemDisplayName, getItemSkuDisplayName } from 'lib/functions/displayInventory'
import CloseIcon from '@mui/icons-material/Close'
import { useAppStore } from 'lib/store'
import SectionPanel from 'components/container/section-panel'

export default function Items() {
  const { batchReceiveSession, setBatchReceiveSession } = useAppStore()
  const removeItem = (removeItem) => {
    const items = batchReceiveSession?.items?.filter((item) => item?.key !== removeItem?.key)
    setBatchReceiveSession({ items })
  }
  return (
    <SectionPanel title="Receive Basket">
      {batchReceiveSession?.items?.length > 0 ? (
        batchReceiveSession?.items?.map((item: any) => {
          return (
            <div key={item?.key} className="flex hover:bg-gray-200 items-center p-2 border-b">
              <button className="p-2" onClick={() => removeItem(item)}>
                <CloseIcon />
              </button>
              {item?.item?.id ? getItemSkuDisplayName(item?.item) : getItemDisplayName(item?.item)}
            </div>
          )
        })
      ) : (
        <div>No items added.</div>
      )}
    </SectionPanel>
  )
}
