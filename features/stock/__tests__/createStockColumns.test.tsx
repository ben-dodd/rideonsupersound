import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { createStockColumns } from '../utils/createStockColumns'
import { STOCK_TABLE_COLORS } from 'lib/types/table'

// Mock Next.js router
const mockPush = jest.fn()
const mockRouter = {
  push: mockPush,
  pathname: '/stock',
  query: {},
  asPath: '/stock',
} as any

describe('createStockColumns', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('View Mode (isEditable: false)', () => {
    it('should create grouped columns for view mode', () => {
      const columns = createStockColumns({ router: mockRouter, isEditable: false })

      expect(columns).toHaveLength(4)
      expect(columns[0].header).toBe('Details')
      expect(columns[1].header).toBe('Prices')
      expect(columns[2].header).toBe('Quantities')
      expect(columns[3].header).toBe('Actions')
    })

    it('should include stock ID column with navigation button', () => {
      const columns = createStockColumns({ router: mockRouter, isEditable: false })
      const detailColumns = columns[0].columns

      const stockIdColumn = detailColumns[0]
      expect(stockIdColumn.header).toBe('Stock ID')
      expect(stockIdColumn.accessorKey).toBe('id')

      // Test cell renderer
      const mockInfo = {
        getValue: () => 123,
        row: { original: { id: 123, vendorId: 1 } },
      }
      const { container } = render(<>{stockIdColumn.cell(mockInfo)}</>)
      const button = container.querySelector('button')

      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-label')
      fireEvent.click(button!)
      expect(mockPush).toHaveBeenCalledWith('/stock/123')
    })

    it('should include all price columns with proper formatting', () => {
      const columns = createStockColumns({ router: mockRouter, isEditable: false })
      const priceColumns = columns[1].columns

      expect(priceColumns).toHaveLength(4)
      expect(priceColumns[0].header).toBe('Sell')
      expect(priceColumns[1].header).toBe('Vendor Cut')
      expect(priceColumns[2].header).toBe('Store Cut')
      expect(priceColumns[3].header).toBe('Margin')
    })

    it('should include all quantity columns', () => {
      const columns = createStockColumns({ router: mockRouter, isEditable: false })
      const quantityColumns = columns[2].columns

      expect(quantityColumns).toHaveLength(5)
      expect(quantityColumns[0].header).toBe('QTY')
      expect(quantityColumns[1].header).toBe('REC')
      expect(quantityColumns[2].header).toBe('RET')
      expect(quantityColumns[3].header).toBe('H/L')
      expect(quantityColumns[4].header).toBe('SOLD')
    })

    it('should include action columns with date formatting', () => {
      const columns = createStockColumns({ router: mockRouter, isEditable: false })
      const actionColumns = columns[3].columns

      expect(actionColumns).toHaveLength(4)
      expect(actionColumns[0].header).toBe('Last Sold')
      expect(actionColumns[1].header).toBe('Last Received')
      expect(actionColumns[2].header).toBe('Last Returned')
      expect(actionColumns[3].header).toBe('Last Modified')
    })
  })

  describe('Edit Mode (isEditable: true)', () => {
    it('should create flat columns for edit mode', () => {
      const columns = createStockColumns({ router: mockRouter, isEditable: true })

      // Should not have grouped structure
      expect(columns.some((col) => col.header === 'Details')).toBe(false)

      // Should have detail, price, and one quantity column
      expect(columns.length).toBeGreaterThan(10)
    })

    it('should include EditCell for title and artist columns', () => {
      const columns = createStockColumns({ router: mockRouter, isEditable: true })

      const titleColumn = columns.find((col) => col.accessorKey === 'title')
      const artistColumn = columns.find((col) => col.accessorKey === 'artist')

      expect(titleColumn).toBeDefined()
      expect(artistColumn).toBeDefined()
      expect(titleColumn?.cell).toBeDefined()
      expect(artistColumn?.cell).toBeDefined()
    })
  })

  describe('Custom Colors', () => {
    it('should use custom colors when provided', () => {
      const customColors = {
        sell: 'text-purple-500',
        vendorCut: 'text-orange-500',
        storeCut: 'text-teal-500',
        link: 'custom-link-class',
      }

      const columns = createStockColumns({
        router: mockRouter,
        isEditable: false,
        colors: customColors,
      })

      const detailColumns = columns[0].columns
      const stockIdColumn = detailColumns[0]

      const mockInfo = {
        getValue: () => 123,
        row: { original: { id: 123, vendorId: 1 } },
      }
      const { container } = render(<>{stockIdColumn.cell(mockInfo)}</>)
      const button = container.querySelector('button')

      expect(button?.className).toContain('custom-link-class')
    })

    it('should use default colors when not provided', () => {
      const columns = createStockColumns({ router: mockRouter, isEditable: false })

      const detailColumns = columns[0].columns
      const stockIdColumn = detailColumns[0]

      const mockInfo = {
        getValue: () => 123,
        row: { original: { id: 123, vendorId: 1 } },
      }
      const { container } = render(<>{stockIdColumn.cell(mockInfo)}</>)
      const button = container.querySelector('button')

      expect(button?.className).toContain(STOCK_TABLE_COLORS.link)
    })
  })

  describe('Accessibility', () => {
    it('should include aria-labels on interactive elements', () => {
      const columns = createStockColumns({ router: mockRouter, isEditable: false })
      const detailColumns = columns[0].columns

      const stockIdColumn = detailColumns[0]
      const mockInfo = {
        getValue: () => 123,
        row: { original: { id: 123, vendorId: 1 } },
      }
      const { container } = render(<>{stockIdColumn.cell(mockInfo)}</>)
      const button = container.querySelector('button')

      expect(button).toHaveAttribute('aria-label')
      expect(button?.getAttribute('aria-label')).toContain('View stock item')
    })

    it('should include aria-labels on icons', () => {
      const columns = createStockColumns({ router: mockRouter, isEditable: false })
      const detailColumns = columns[0].columns

      const isNewColumn = detailColumns.find((col) => col.accessorKey === 'isNew')
      expect(isNewColumn).toBeDefined()

      // Test with true value
      const mockInfoTrue = { getValue: () => true }
      const { container: containerTrue } = render(<>{isNewColumn?.cell(mockInfoTrue)}</>)
      const checkIcon = containerTrue.querySelector('svg')
      expect(checkIcon).toHaveAttribute('aria-label', 'Yes, is new')

      // Test with false value
      const mockInfoFalse = { getValue: () => false }
      const { container: containerFalse } = render(<>{isNewColumn?.cell(mockInfoFalse)}</>)
      const closeIcon = containerFalse.querySelector('svg')
      expect(closeIcon).toHaveAttribute('aria-label', 'No, not new')
    })
  })

  describe('Vendor Column', () => {
    it('should render vendor with navigation button', () => {
      const columns = createStockColumns({ router: mockRouter, isEditable: false })
      const detailColumns = columns[0].columns

      const vendorColumn = detailColumns.find((col) => col.accessorKey === 'vendorName')
      expect(vendorColumn).toBeDefined()

      const mockInfo = {
        row: {
          original: {
            vendorId: 42,
            vendorName: 'Test Vendor',
          },
        },
      }

      const { container } = render(<>{vendorColumn?.cell(mockInfo)}</>)
      const button = container.querySelector('button')

      expect(button).toBeInTheDocument()
      expect(button?.textContent).toBe('[42] Test Vendor')
      expect(button).toHaveAttribute('aria-label', 'View vendor Test Vendor')

      fireEvent.click(button!)
      expect(mockPush).toHaveBeenCalledWith('/vendors/42')
    })
  })
})
