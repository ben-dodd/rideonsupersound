import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Table from 'components/data/table'
import Loading from 'components/placeholders/loading'
import ErrorScreen from 'components/container/error-screen'
import { useStockTableData } from './hooks/useStockTableData'
import { createStockColumns } from './utils/createStockColumns'
import { Pages } from 'lib/store/types'

const ViewStockTable: React.FC = () => {
  const router = useRouter()
  const { collatedStockList, isLoading, error, filters, searchBar, setPageFilter, setSearchBar } =
    useStockTableData('list')

  const [pagination, setPagination] = useState(filters?.pagination)
  const [sorting, setSorting] = useState(filters?.sorting)
  const [columnVisibility, setColumnVisibility] = useState(filters?.visibleColumns)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchBar(Pages.stockPage, e.target.value, 'list')

  // Sync state changes back to store
  useEffect(() => {
    setPageFilter(Pages.stockPage, { pagination, sorting }, 'list')
  }, [pagination, setPageFilter, sorting])

  useEffect(() => {
    setPageFilter(Pages.stockPage, { visibleColumns: columnVisibility }, 'list')
  }, [columnVisibility, setPageFilter])

  const columns = useMemo(() => createStockColumns({ router, isEditable: false }), [router])

  if (error) {
    return <ErrorScreen message="Failed to load stock data" />
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <Table
      columns={columns}
      data={collatedStockList}
      showPagination
      searchable
      initPagination={filters?.pagination}
      onPaginationChange={setPagination}
      initSorting={filters?.sorting}
      onSortingChange={setSorting}
      initColumnVisibility={filters?.visibleColumns}
      onColumnVisibilityChange={setColumnVisibility}
      searchValue={searchBar}
      handleSearch={handleSearch}
    />
  )
}

export default React.memo(ViewStockTable)
