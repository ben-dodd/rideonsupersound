// import dayjs from 'dayjs'
// import { ClerkObject } from 'lib/types'
// import { HoldObject } from 'lib/types/sale'
// import { StockMovementTypes } from 'lib/types/stock'

// export async function returnHoldToStock(
//   hold: HoldObject,
//   clerk: ClerkObject,
//   holds: HoldObject[],
//   mutateHolds: Function,
//   mutateInventory: Function,
//   registerId: number,
// ) {
//   updateHoldInDatabase({
//     ...hold,
//     date_removed_from_hold: dayjs.utc().format(),
//     removed_from_hold_by: clerk?.id,
//   })
//   mutateHolds(
//     holds?.filter((h) => h?.id !== hold?.id),
//     false,
//   )
//   createStockMovementInDatabase(
//     { item_id: hold?.item_id, quantity: hold?.quantity?.toString() },
//     clerk,
//     registerId,
//     StockMovementTypes.Unhold,
//     hold?.note,
//   )
//   mutateInventory()
// }

export {}