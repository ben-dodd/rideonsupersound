// import SearchInput from 'components/inputs/search-input'
// import { useStockItemList, useStockList } from 'lib/api/stock'
// import { useAppStore } from 'lib/store'
// import { Pages } from 'lib/store/types'
// import StockFilter from './filter'
// import { BasicStockItemObject } from 'lib/types/stock'
// import { getItemSku } from 'lib/functions/displayInventory'
// import StockListList from './list'
// import StockListTable from './table'
// import StockListSheet from './sheet'

// const StockList = () => {
//   const { stockList, isStockListLoading } = useStockList()
//   const {
//     viewMode,
//     stockPage: { searchBar, limit, filterSettings },
//     setSearchBar,
//     setPageFilter,
//   } = useAppStore()

//   const setSetting = (setting, e) => {
//     setPageFilter(Pages.stockPage, setting, e ? e.map((obj: any) => obj.value) : [])
//   }
//   const handleSearch = (e) => setSearchBar(Pages.stockPage, e.target.value)

//   // console.log(filterSettings)

//   const idList = stockList
//     ?.filter?.(
//       (stockItem) =>
//         (filterSettings?.artist?.length === 0 || filterSettings.artist?.includes(stockItem?.artist)) &&
//         `${stockItem?.artist} ${stockItem?.title}`?.toUpperCase?.()?.includes(searchBar?.toUpperCase()),
//     )
//     ?.reverse()
//     ?.slice(0, limit)
//     ?.map((item: BasicStockItemObject) => item?.id)

//   const { stockItemList = [], isStockItemListLoading = true } = useStockItemList(idList)

//   // console.log(stockItemList)

//   const stockSchema = [
//     {
//       key: 'id',
//       header: 'Stock ID',
//       getValue: (row) => row?.item?.id,
//     },
//     { key: 'vendorId', header: 'Vendor ID', getValue: (row) => row?.item?.vendorId },
//     { key: 'sku', header: 'SKU', getValue: (row) => getItemSku(row?.item), isLocked: true },
//     {
//       key: 'artist',
//       header: 'Artist',
//       getValue: (row) => row?.item?.artist,
//     },
//     {
//       key: 'title',
//       header: 'Title',
//       getValue: (row) => row?.item?.title,
//     },
//   ]

//   return (
//     <div className="h-content overflow-y-scroll">
//       <div className="px-2 flex justify-between w-full">
//         <SearchInput searchValue={searchBar} handleSearch={handleSearch} />
//         <StockFilter stockList={stockList} setSettings={setSetting} filterSettings={filterSettings} />
//       </div>
//       <div className="px-2">
//         {viewMode === 'table' ? (
//           <StockListTable stockItemList={stockItemList} stockSchema={stockSchema} />
//         ) : viewMode === 'sheet' ? (
//           <StockListSheet stockItemList={stockItemList} stockSchema={stockSchema} isLoading={isStockItemListLoading} />
//         ) : (
//           <StockListList stockItemList={stockItemList} />
//         )}
//       </div>
//     </div>
//   )
// }

// export default StockList

export {}
