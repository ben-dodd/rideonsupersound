// import StocktakeTemplateListItem from './stocktake-template-list-item'

// export default function StocktakeListScreen() {
//   const { stocktakeTemplates, isStocktakeTemplatesLoading } =
//     useStocktakeTemplates()
//   return (
//     <div className="flex flex-col w-full">
//       <div className="bg-col1 text-4xl font-bold uppercase text-white p-2 mb-1">
//         Stocktakes
//       </div>
//       {/* <Tabs tabs={["Logs", "Stock Movement"]} value={tab} onChange={setTab} /> */}
//       {isStocktakeTemplatesLoading ? (
//         <div className="loading-screen">
//           <div className="loading-icon" />
//         </div>
//       ) : (
//         <div className="h-inventory w-full overflow-y-scroll px-2 bg-white grid grid-cols-3">
//           {stocktakeTemplates?.length > 0
//             ? stocktakeTemplates?.map((st) => (
//                 <StocktakeTemplateListItem
//                   key={st?.id}
//                   stocktakeTemplate={st}
//                 />
//               ))
//             : 'No stocktake templates found.'}
//         </div>
//       )}
//     </div>
//   )
// }
