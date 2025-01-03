import { AddCircle, Delete, DisplaySettings, FilterAlt } from '@mui/icons-material'
import Table from 'components/data/table'
import dayjs from 'dayjs'
import { useSetting } from 'lib/api/settings'
import { useVendorsFull } from 'lib/api/vendor'
import { useAppStore } from 'lib/store'
import { Pages, ViewProps } from 'lib/store/types'
import { dateSimple } from 'lib/types/date'
import { priceCentsString, sortDates } from 'lib/utils'
import { tableFilterDateRange, tableFilterStartsWith } from 'lib/utils/filters'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

const VendorTable = () => {
  const router = useRouter()
  const {
    pages: {
      vendorsPage: { filter, searchBar, selected },
    },
    setPageFilter,
    setPage,
    openView,
    setSearchBar,
  } = useAppStore()
  const menuItems = [
    { text: 'New Vendor', icon: <AddCircle />, onClick: () => openView(ViewProps.vendorEditDialog) },
    { text: 'Filter Results', icon: <FilterAlt />, onClick: null, disabled: true },
    { text: 'Manage Settings', icon: <DisplaySettings />, onClick: null, disabled: true },
    { hr: true },
    { text: 'Delete Selected', icon: <Delete />, onClick: null, disabled: Object.keys(selected)?.length === 0 },
  ]

  const { vendors, isVendorsLoading } = useVendorsFull()
  const { selects: vendorCategories, isSelectsLoading: isVendorCategoriesLoading } = useSetting('vendorCategory')
  const [pagination, setPagination] = useState(filter?.pagination)
  const [sorting, setSorting] = useState(filter?.sorting)
  // const [columnVisibility, setColumnVisibility] = useState(filters?.columnVisibility)
  const handleSearch = (e) => setSearchBar(Pages.vendorsPage, e.target.value)
  const handleSelect = (e) => setPage(Pages.vendorsPage, { selected: e })

  console.log(vendors)

  // Handle sort, pagination and filter changes
  // Do not add filters or setFilters to dependencies
  useEffect(() => {
    setPageFilter(Pages.stockPage, { pagination, sorting })
  }, [pagination, setPageFilter, sorting])

  // useEffect(() => {
  //   setPageFilter(Pages.stockPage, { visibleColumns: columnVisibility }, 'list')
  // }, [columnVisibility, setPageFilter])

  const filteredVendors = vendors?.filter((vendor) => vendor?.name?.toLowerCase()?.includes(searchBar?.toLowerCase()))

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 100,
        filterFn: tableFilterStartsWith,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 300,
        cell: (info) => (
          <span className="link-blue" onClick={() => router.push(`/vendors/${info.row?.original?.id}`)}>
            {info.getValue()}
          </span>
        ),
        sortDescFirst: false,
        filterFn: 'includesString',
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
        filterFn: 'includesString',
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
        filterFn: 'includesString',
      },
      {
        accessorKey: 'vendorCategory',
        header: 'Vendor Category',
        size: 100,
        filterFn: 'equalsString',
        meta: {
          filterVariant: 'select',
          selectOptions: vendorCategories?.sort()?.map((opt: string) => ({
            value: opt,
            label: opt,
          })),
        },
      },
      {
        accessorKey: 'totalUnitsInStock',
        header: 'Units In Stock',
        size: 100,
        cell: (info) =>
          info.getValue() ? (
            <span>{`${info.row.original.totalUnitsInStock}/${info.row.original.totalItems}`}</span>
          ) : (
            'N/A'
          ),
        filterFn: 'inNumberRange',
        meta: {
          filterVariant: 'range',
        },
      },
      {
        accessorKey: 'totalSales',
        header: 'Total Sales',
        size: 100,
        filterFn: 'inNumberRange',
        meta: {
          filterVariant: 'range',
        },
      },
      {
        accessorKey: 'totalSell',
        header: 'Total Sell',
        size: 100,
        cell: (info) => priceCentsString(info.getValue()),
        filterFn: 'inNumberRange',
        meta: {
          filterVariant: 'range',
        },
      },
      {
        accessorKey: 'totalPaid',
        header: 'Total Paid',
        size: 100,
        cell: (info) => priceCentsString(info.getValue()),
        filterFn: 'inNumberRange',
        meta: {
          filterVariant: 'range',
        },
      },
      {
        accessorKey: 'totalOwing',
        header: 'Total Owing',
        size: 100,
        cell: (info) => priceCentsString(info.getValue()),
        filterFn: 'inNumberRange',
        meta: {
          filterVariant: 'range',
        },
      },
      {
        accessorKey: 'lastSold',
        header: 'Last Sale',
        size: 100,
        cell: (info) => (info.getValue() ? dayjs(info.getValue()).format(dateSimple) : 'N/A'),
        sortingFn: (rowA, rowB) => sortDates(rowA.original.lastSold, rowB.original.lastSold),
        filterFn: tableFilterDateRange,
        meta: {
          filterVariant: 'dateRange',
        },
      },
      {
        accessorKey: 'lastPaid',
        header: 'Last Paid',
        size: 100,
        cell: (info) => (info.getValue() ? dayjs(info.getValue()).format(dateSimple) : 'N/A'),
        sortingFn: (rowA, rowB) => sortDates(rowA.original.lastPaid, rowB.original.lastPaid),
        filterFn: tableFilterDateRange,
        meta: {
          filterVariant: 'dateRange',
        },
      },
      {
        accessorKey: 'lastContacted',
        header: 'Last Contacted',
        size: 100,
        cell: (info) => (info.getValue() ? dayjs(info.getValue()).format(dateSimple) : 'N/A'),
        sortingFn: (rowA, rowB) => sortDates(rowA.original.lastContacted, rowB.original.lastContacted),
        filterFn: tableFilterDateRange,
        meta: {
          filterVariant: 'dateRange',
        },
      },
      {
        accessorKey: 'dateCreated',
        header: 'Date Created',
        size: 100,
        cell: (info) => dayjs(info.getValue()).format(dateSimple),
        sortingFn: (rowA, rowB) => sortDates(rowA.original.dateCreated, rowB.original.dateCreated),
        filterFn: tableFilterDateRange,
        meta: {
          filterVariant: 'dateRange',
        },
      },
    ],
    [],
  )
  // console.log(data)
  return (
    <>
      <Table
        title="Vendors"
        titleClass="bg-col3"
        columns={columns}
        data={filteredVendors}
        isLoading={isVendorsLoading || isVendorCategoriesLoading}
        menuItems={menuItems}
        initPagination={filter?.pagination}
        onPaginationChange={setPagination}
        initSorting={filter?.sorting}
        onSortingChange={setSorting}
        searchValue={searchBar}
        handleSearch={handleSearch}
        setRowSelection={handleSelect}
        initSelection={selected}
      />
    </>
  )
}

export default VendorTable
