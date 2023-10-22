// import { logStocktakeAdjustment, logStocktakeKeep } from 'lib/functions/log'
// import {
//   ClerkObject,
//   StockMovementTypes,
//   StockObject,
//   StocktakeItemObject,
//   StocktakeObject,
//   StocktakeReviewDecisions,
//   StocktakeStatuses,
//   StocktakeTemplateObject,
//   TaskObject,
// } from 'lib/types'
// import dayjs from 'dayjs'
// import { getItemById, getItemSkuDisplayName } from './displayInventory'

// export function writeStocktakeFilterDescription(
//   stocktake: StocktakeTemplateObject
// ) {
//   const maxNum = 20
//   let filters = []
//   if (stocktake?.mediaEnabled && stocktake?.mediaList?.length > 0)
//     filters?.push(
//       `Media Filters: ${
//         stocktake?.mediaList?.length < maxNum
//           ? stocktake?.mediaList?.join?.(', ')
//           : `${stocktake?.mediaList?.length} Media Types`
//       }`
//     )
//   if (stocktake?.formatEnabled && stocktake?.formatList?.length > 0)
//     filters?.push(
//       `Format Filters: ${
//         stocktake?.formatList?.length < maxNum
//           ? stocktake?.formatList?.join?.(', ')
//           : `${stocktake?.formatList?.length} Formats`
//       }`
//     )
//   if (stocktake?.sectionEnabled && stocktake?.sectionList?.length > 0)
//     filters?.push(
//       `Section Filters: ${
//         stocktake?.sectionList?.length < maxNum
//           ? stocktake?.sectionList?.join?.(', ')
//           : `${stocktake?.sectionList?.length} Sections`
//       }`
//     )
//   if (stocktake?.vendorEnabled && stocktake?.vendorList?.length > 0)
//     filters?.push(
//       `Vendor Filters: ${
//         stocktake?.vendorList?.length < maxNum
//           ? stocktake?.vendorList?.join?.(', ')
//           : `${stocktake?.vendorList?.length} Vendors`
//       }`
//     )
//   if (filters?.length > 0) {
//     return filters?.join?.(', ')
//   } else return 'No Filters'
// }
// // TODO move process stocktake to db function

// export function processStocktake(
//   stocktake: StocktakeObject,
//   stocktakeTemplate: StocktakeTemplateObject,
//   stocktakeItems: StocktakeItemObject[],
//   inventory: StockObject[],
//   clerk: ClerkObject
// ) {
//   let tasks = []
//   stocktakeItems?.forEach(async (item: StocktakeItemObject) => {
//     if (item?.quantityCounted === item?.quantityRecorded) {
//       // Do nothing
//     } else if (item?.reviewDecision === StocktakeReviewDecisions?.keep) {
//       logStocktakeKeep(item, inventory, clerk)
//     } else if (
//       item?.reviewDecision === StocktakeReviewDecisions?.review ||
//       !item?.reviewDecision
//     ) {
//       let newTask: TaskObject = {
//         description: `Review stock take. ${getItemSkuDisplayName(
//           getItemById(item?.stockId, inventory)
//         )}. ${item?.quantityCounted} counted, ${
//           item?.quantityRecorded
//         } in the system.`,
//         createdByClerkId: clerk?.id,
//         dateCreated: dayjs.utc().format(),
//       }
//       const id = await createTaskInDatabase(newTask)
//       tasks?.push({ ...newTask, id })
//     } else {
//       let act = StockMovementTypes?.Adjustment
//       if (item?.reviewDecision === StocktakeReviewDecisions?.discard)
//         act = StockMovementTypes?.Discarded
//       else if (item?.reviewDecision === StocktakeReviewDecisions?.found)
//         act = StockMovementTypes?.Found
//       else if (item?.reviewDecision === StocktakeReviewDecisions?.lost)
//         act = StockMovementTypes?.Lost
//       else if (item?.reviewDecision === StocktakeReviewDecisions?.return)
//         act = StockMovementTypes?.Returned
//       createStockMovementInDatabase({
//         item: {
//           itemId: item?.stockId,
//           quantity: `${item?.quantityDifference}`,
//         },
//         clerk,
//         act,
//         note: 'Stock take adjustment.',
//         stocktake_id: stocktake?.id,
//       })
//       logStocktakeAdjustment(item, inventory, act, clerk)
//     }
//   })
//   updateStocktakeInDatabase({
//     ...stocktake,
//     date_closed: dayjs.utc().format(),
//     closed_by: clerk?.id,
//   })
//   updateStocktakeTemplateInDatabase({
//     ...stocktakeTemplate,
//     last_completed: dayjs.utc().format(),
//     status: StocktakeStatuses?.completed,
//   })
// }

export {}
