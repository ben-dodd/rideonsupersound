import { renderHook } from '@testing-library/react'
import { useStockTableData } from '../hooks/useStockTableData'
import { useAllStockMovements, useStockList } from 'lib/api/stock'
import { useAppStore } from 'lib/store'

// Mock dependencies
jest.mock('lib/api/stock')
jest.mock('lib/store')
jest.mock('lib/functions/sell')
jest.mock('lib/functions/stock')

const mockUseStockList = useStockList as jest.MockedFunction<typeof useStockList>
const mockUseAllStockMovements = useAllStockMovements as jest.MockedFunction<typeof useAllStockMovements>
const mockUseAppStore = useAppStore as jest.MockedFunction<typeof useAppStore>

describe('useStockTableData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return loading state when data is loading', () => {
    mockUseStockList.mockReturnValue({
      stockList: [],
      isStockListLoading: true,
      error: null,
    })
    mockUseAllStockMovements.mockReturnValue({
      stockMovements: [],
      isStockMovementsLoading: true,
      error: null,
    })
    mockUseAppStore.mockReturnValue({
      pages: {
        stockPage: {
          filter: { list: {} },
          searchBar: { list: '' },
        },
      },
      setPageFilter: jest.fn(),
      setSearchBar: jest.fn(),
    } as any)

    const { result } = renderHook(() => useStockTableData('list'))

    expect(result.current.isLoading).toBe(true)
  })

  it('should return error state when there is an error', () => {
    const mockError = new Error('Failed to load')
    mockUseStockList.mockReturnValue({
      stockList: [],
      isStockListLoading: false,
      error: mockError,
    })
    mockUseAllStockMovements.mockReturnValue({
      stockMovements: [],
      isStockMovementsLoading: false,
      error: null,
    })
    mockUseAppStore.mockReturnValue({
      pages: {
        stockPage: {
          filter: { list: {} },
          searchBar: { list: '' },
        },
      },
      setPageFilter: jest.fn(),
      setSearchBar: jest.fn(),
    } as any)

    const { result } = renderHook(() => useStockTableData('list'))

    expect(result.current.error).toBe(mockError)
  })

  it('should use list filter type correctly', () => {
    mockUseStockList.mockReturnValue({
      stockList: [],
      isStockListLoading: false,
      error: null,
    })
    mockUseAllStockMovements.mockReturnValue({
      stockMovements: [],
      isStockMovementsLoading: false,
      error: null,
    })
    mockUseAppStore.mockReturnValue({
      pages: {
        stockPage: {
          filter: { list: { pagination: { pageIndex: 0, pageSize: 10 } } },
          searchBar: { list: 'test' },
        },
      },
      setPageFilter: jest.fn(),
      setSearchBar: jest.fn(),
    } as any)

    const { result } = renderHook(() => useStockTableData('list'))

    expect(result.current.searchBar).toBe('test')
    expect(result.current.filters).toEqual({ pagination: { pageIndex: 0, pageSize: 10 } })
  })

  it('should use edit filter type correctly', () => {
    mockUseStockList.mockReturnValue({
      stockList: [],
      isStockListLoading: false,
      error: null,
    })
    mockUseAllStockMovements.mockReturnValue({
      stockMovements: [],
      isStockMovementsLoading: false,
      error: null,
    })
    mockUseAppStore.mockReturnValue({
      pages: {
        stockPage: {
          filter: { edit: { pagination: { pageIndex: 1, pageSize: 20 } } },
          searchBar: { edit: 'edit search' },
        },
      },
      setPageFilter: jest.fn(),
      setSearchBar: jest.fn(),
    } as any)

    const { result } = renderHook(() => useStockTableData('edit'))

    expect(result.current.searchBar).toBe('edit search')
    expect(result.current.filters).toEqual({ pagination: { pageIndex: 1, pageSize: 20 } })
  })
})
