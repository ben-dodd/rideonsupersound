import { logReturnStock } from 'features/log/lib/functions'
import { createStockMovementInDatabase } from 'lib/database/create'
import {
  ClerkObject,
  LogObject,
  StockMovementTypes,
  StockObject,
} from 'lib/types'

export function returnStock(
  vendorId: number,
  returnItems: any,
  notes: string,
  clerk: ClerkObject,
  registerID: number,
  inventory: StockObject[],
  mutateInventory: Function
  // logs: LogObject[],
  // mutateLogs: Function
) {
  if (vendorId && returnItems?.length > 0) {
    const itemIds = returnItems?.map((returnItem) => parseInt(returnItem?.id))
    const otherInventoryItems = inventory?.filter(
      (i: StockObject) => !itemIds?.includes(i?.id)
    )
    let updatedInventoryItems = []
    returnItems
      .filter((returnItem: any) => parseInt(`${returnItem?.quantity}`) > 0)
      .forEach((returnItem: any) => {
        const stockItem = inventory?.find(
          (i: StockObject) => i?.id === parseInt(returnItem?.id)
        )
        updatedInventoryItems.push({
          ...stockItem,
          quantity_returned:
            (stockItem?.quantityReturned || 0) + parseInt(returnItem?.quantity),
          quantity: (stockItem?.quantity || 0) - parseInt(returnItem?.quantity),
        })
        createStockMovementInDatabase({
          item: {
            itemId: parseInt(returnItem?.id),
            quantity: `${returnItem?.quantity}`,
          },
          clerk,
          registerID,
          act: StockMovementTypes?.Returned,
          note: notes || 'Stock returned to vendor.',
        })
        logReturnStock(stockItem, returnItem, clerk)
      })
    mutateInventory([...otherInventoryItems, ...updatedInventoryItems], false)
  }
}
