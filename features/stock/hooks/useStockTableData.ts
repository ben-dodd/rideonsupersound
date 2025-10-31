import { useMemo } from 'react'
import { useAllStockMovements, useStockList } from 'lib/api/stock'
import { filterInventory } from 'lib/functions/sell'
import { collateStockList } from 'lib/functions/stock'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import type { CollatedStockItem } from 'lib/types/table'

export const useStockTableData = (filterType: 'list' | 'edit') => {
  const {
    pages: {
      stockPage: {
        filter: { [filterType]: filters },
        searchBar: { [filterType]: searchBar },
      },
    },
    setPageFilter,
    setSearchBar,
  } = useAppStore()

  const { stockList = [], isStockListLoading = true, error: stockListError } = useStockList()
  const { stockMovements = [], isStockMovementsLoading = true, error: stockMovementsError } = useAllStockMovements()

  const filteredStockList = useMemo(
    () => stockList?.filter((stockItem) => filterInventory(stockItem, searchBar)),
    [stockList, searchBar],
  )

  const collatedStockList = useMemo(
    () => collateStockList(filteredStockList, stockMovements) as CollatedStockItem[],
    [filteredStockList, stockMovements],
  )

  return {
    collatedStockList,
    isLoading: isStockListLoading || isStockMovementsLoading,
    error: stockListError || stockMovementsError,
    filters,
    searchBar,
    setPageFilter,
    setSearchBar,
  }
}
