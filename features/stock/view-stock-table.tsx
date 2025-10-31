import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Table from 'components/data/table'
import Loading from 'components/placeholders/loading'
import ErrorScreen from 'components/container/error-screen'
import { useStockTableData } from './hooks/useStockTableData'
import { createStockColumns } from './utils/createStockColumns'
import { ColumnGroupToggles } from './components/ColumnGroupToggles'
import { Pages } from 'lib/store/types'

const ViewStockTable: React.FC = () => {
  const router = useRouter()
  const { collatedStockList, isLoading, error, filters, searchBar, setPageFilter, setSearchBar } =
    useStockTableData('list')

  const [pagination, setPagination] = useState(filters?.pagination)
  const [sorting, setSorting] = useState(filters?.sorting)
  const [columnVisibility, setColumnVisibility] = useState(filters?.visibleColumns)

  // Column group visibility state - default to showing essential + details only
  const [visibleGroups, setVisibleGroups] = useState(
    filters?.columnGroups || {
      essential: true,
      details: true,
      prices: false,
      quantities: false,
      history: false,
    },
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchBar(Pages.stockPage, e.target.value, 'list')

  const handleToggleGroup = (group: string) => {
    setVisibleGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }))
  }

  // Sync state changes back to store
  useEffect(() => {
    setPageFilter(Pages.stockPage, { pagination, sorting }, 'list')
  }, [pagination, setPageFilter, sorting])

  useEffect(() => {
    setPageFilter(Pages.stockPage, { visibleColumns: columnVisibility }, 'list')
  }, [columnVisibility, setPageFilter])

  useEffect(() => {
    setPageFilter(Pages.stockPage, { columnGroups: visibleGroups }, 'list')
  }, [visibleGroups, setPageFilter])

  const allColumns = useMemo(() => createStockColumns({ router, isEditable: false }), [router])

  // Filter columns based on visible groups
  const columns = useMemo(() => {
    return allColumns.filter((col) => visibleGroups[col.group])
  }, [allColumns, visibleGroups])

  if (error) {
    return <ErrorScreen message="Failed to load stock data" />
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="flex flex-col h-full">
      <ColumnGroupToggles visibleGroups={visibleGroups} onToggle={handleToggleGroup} />
      <div className="flex-1 overflow-hidden">
        <Table
          columns={columns}
          data={collatedStockList}
          showPagination
          searchable
          enableColumnResizing={false}
          initPagination={filters?.pagination}
          onPaginationChange={setPagination}
          initSorting={filters?.sorting}
          onSortingChange={setSorting}
          initColumnVisibility={filters?.visibleColumns}
          onColumnVisibilityChange={setColumnVisibility}
          searchValue={searchBar}
          handleSearch={handleSearch}
        />
      </div>
    </div>
  )
}

export default React.memo(ViewStockTable)
