// import { StocktakeObject } from 'lib/types/stock'
// import { LinearProgress } from '@mui/material'
// import dayjs from 'dayjs'
// import { dateSimple } from 'lib/types/date'

// type ListItemProps = {
//   stocktake: StocktakeObject
// }

// export default function StocktakeListItem({ stocktake }: ListItemProps) {
//   // SWR
//   const [view, setView] = useAtom(viewAtom)
//   const [, setLoadedStocktakeId] = useAtom(loadedStocktakeIdAtom)
//   // console.log(stocktake);

//   return (
//     <div
//       className={`flex w-full border-b border-red-100 py-1 text-sm hover:bg-gray-100 cursor-pointer`}
//       onClick={() => {
//         setView({ ...view, stocktakeScreen: true })
//         setLoadedStocktakeId(stocktake?.id)
//       }}
//     >
//       <div className="font-bold w-1/4">{dayjs(stocktake?.date_started).format(dateSimple)}</div>
//       <div className="mx-2 w-full w-3/4">
//         <div className="font-bold">
//           {stocktake?.date_cancelled ? (
//             <div>Cancelled</div>
//           ) : stocktake?.date_closed ? (
//             <div>{`Completed on ${dayjs(stocktake?.date_closed).format(dateSimple)}`}</div>
//           ) : (
//             <>
//               <div>{`In Progress`}</div>
//               <LinearProgress
//                 variant="determinate"
//                 value={((stocktake?.total_counted || 0) / (stocktake?.total_estimated || 1)) * 100}
//               />
//             </>
//           )}
//         </div>

//         {/* <CSVLink
//         className={`bg-col2-dark hover:bg-col2 disabled:bg-gray-200 p-2 rounded`}
//         data={getCSVData(getStock())}
//         headers={["SKU", "ARTIST", "TITLE", "NEW/USED", "SELL PRICE", "GENRE"]}
//         filename={`label-print-${dayjs().format("YYYY-MM-DD")}.csv`}
//         onClick={() =>
//           save log(
//             {
//               log: "Labels printed from receive stock dialog.",
//               clerk_id: clerk?.id,
//             },
//             logs,
//             mutateLogs
//           )
//         }
//       >
//         PRINT LABELS
//       </CSVLink> */}
//       </div>
//     </div>
//   )
// }

export {}
