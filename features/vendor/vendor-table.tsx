import Table from 'components/data/table'
import Loading from 'components/placeholders/loading'
import { useVendors } from 'lib/api/vendor'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

const VendorTable = () => {
  const router = useRouter()
  const {
    pages: {
      vendorsPage: {
        filter: { list: filters },
        searchBar: { list: searchBar },
      },
    },
    setPageFilter,
    setSearchBar,
  } = useAppStore()

  const { vendors, isVendorsLoading } = useVendors()
  console.log(vendors)
  console.log(filters)
  // const filteredStockList = stockList?.filter((stockItem) => filterInventory(stockItem, searchBar))

  // const collatedStockList = useMemo(
  //   () => collateStockList(filteredStockList, stockMovements),
  //   [filteredStockList, stockMovements],
  // )
  const [pagination, setPagination] = useState(filters?.pagination)
  const [sorting, setSorting] = useState(filters?.sorting)
  // const [columnVisibility, setColumnVisibility] = useState(filters?.columnVisibility)
  const handleSearch = (e) => setSearchBar(Pages.stockPage, e.target.value)

  // Handle sort, pagination and filter changes
  // Do not add filters or setFilters to dependencies
  useEffect(() => {
    setPageFilter(Pages.stockPage, { pagination, sorting }, 'list')
  }, [pagination, setPageFilter, sorting])

  // useEffect(() => {
  //   setPageFilter(Pages.stockPage, { visibleColumns: columnVisibility }, 'list')
  // }, [columnVisibility, setPageFilter])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 100,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 300,
        cell: (info) => (
          <span className="link-blue" onClick={() => router.push(`/vendor/${info.row?.original?.id}`)}>
            {info.getValue()}
          </span>
        ),
        sortDescFirst: false,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => (
          <span className="link-blue" onClick={() => router.push(`mailto:${info.getValue()}`)}>
            {info.getValue()}
          </span>
        ),
        size: 190,
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: (info) => (
          <span className="link-blue" onClick={() => router.push(`tel:${info.getValue()}`)}>
            {info.getValue()}
          </span>
        ),
        size: 190,
      },
      {
        accessorKey: 'vendorCategory',
        header: 'Vendor Category',
        size: 100,
      },
    ],
    [],
  )
  // console.log(data)
  return isVendorsLoading ? (
    <Loading />
  ) : (
    <Table
      columns={columns}
      data={vendors}
      showPagination
      searchable
      initPagination={filters?.pagination}
      onPaginationChange={setPagination}
      initSorting={filters?.sorting}
      onSortingChange={setSorting}
      searchValue={searchBar}
      handleSearch={handleSearch}
    />
  )
}

export default VendorTable
