import { AddCircle, Delete, DisplaySettings, FilterAlt } from '@mui/icons-material'
import Table from 'components/data/table'
import dayjs from 'dayjs'
import { useVendors } from 'lib/api/vendor'
import { useAppStore } from 'lib/store'
import { Pages, ViewProps } from 'lib/store/types'
import { dateSimple } from 'lib/types/date'
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

  const { vendors, isVendorsLoading } = useVendors()
  const [pagination, setPagination] = useState(filter?.pagination)
  const [sorting, setSorting] = useState(filter?.sorting)
  // const [columnVisibility, setColumnVisibility] = useState(filters?.columnVisibility)
  const handleSearch = (e) => setSearchBar(Pages.vendorsPage, e.target.value)
  const handleSelect = (e) => setPage(Pages.vendorsPage, { selected: e })

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
      {
        accessorKey: 'lastContacted',
        header: 'Last Contacted',
        size: 100,
        cell: (info) => (info.getValue() ? dayjs(info.getValue()).format(dateSimple) : 'N/A'),
        sortingFn: (rowA, rowB) => dayjs(rowA.original.lastContacted).isBefore(dayjs(rowB.original.lastContacted)),
      },
      {
        accessorKey: 'dateCreated',
        header: 'Date Created',
        size: 100,
        cell: (info) => dayjs(info.getValue()).format(dateSimple),
        sortingFn: (rowA, rowB) => dayjs(rowA.original.dateCreated).isBefore(dayjs(rowB.original.dateCreated)),
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
        isLoading={isVendorsLoading}
        menuItems={menuItems}
        showPagination
        showEdit
        searchable
        initPagination={filter?.pagination}
        onPaginationChange={setPagination}
        initSorting={filter?.sorting}
        onSortingChange={setSorting}
        searchValue={searchBar}
        handleSearch={handleSearch}
        selectable={true}
        setRowSelection={handleSelect}
        initSelection={selected}
      />
    </>
  )
}

export default VendorTable
