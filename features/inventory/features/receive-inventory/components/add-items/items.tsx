import {
  getItemDisplayName,
  getItemSkuDisplayName,
} from 'features/inventory/features/display-inventory/lib/functions'
import CloseIcon from '@mui/icons-material/Close'
import { useAppStore } from 'lib/store'

export default function Items() {
  const { receiveBasket, setReceiveBasket } = useAppStore()
  const removeItem = (removeItem) => {
    const items = receiveBasket?.items?.filter(
      (item) => item?.key !== removeItem?.key
    )
    setReceiveBasket({ items })
  }
  return (
    <div>
      {receiveBasket?.items?.length > 0 ? (
        receiveBasket?.items?.map((item: any) => {
          return (
            <div
              key={item?.key}
              className="flex hover:bg-gray-200 items-center p-2 border-b"
            >
              <button className="p-2" onClick={() => removeItem(item)}>
                <CloseIcon />
              </button>
              {item?.item?.id
                ? getItemSkuDisplayName(item?.item)
                : getItemDisplayName(item?.item)}
            </div>
          )
        })
      ) : (
        <div>No items added.</div>
      )}
    </div>
  )
}
