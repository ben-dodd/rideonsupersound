import { StockItemSearchObject } from './stock'

// Collated stock item with computed quantities and last movements
export interface CollatedStockItem extends StockItemSearchObject {
  totalSell?: number
  vendorCut?: number
  storeCut?: number
  quantities: {
    inStock: number
    received: number
    returned: number
    holdLayby: number
    sold: number
    layby?: number
    hold?: number
    laybyHold?: number
    discarded?: number
    lost?: number
    discardedLost?: number
    refunded?: number
    adjustment?: number
  }
  lastMovements: {
    modified?: string
    sold?: string
    received?: string
    returned?: string
  }
}

export interface StockTableColors {
  sell: string
  vendorCut: string
  storeCut: string
  link: string
}

export const STOCK_TABLE_COLORS: StockTableColors = {
  sell: 'text-blue-500',
  vendorCut: 'text-red-500',
  storeCut: 'text-green-500',
  link: 'link-blue hover:underline focus:outline-none focus:ring-2',
} as const
