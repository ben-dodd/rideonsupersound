import React, { useMemo, useState } from 'react'
import { useStockMovements } from 'lib/api/stock'
import { LogContainer } from 'components/log/LogContainer'
import { LogEntryProps } from 'components/log/LogEntry'
import dayjs from 'dayjs'

const StockMovementList = () => {
  const [searchValue, setSearchValue] = useState('')
  const { stockMovements } = useStockMovements()

  const logEntries = useMemo((): LogEntryProps[] => {
    if (!stockMovements) return []

    return stockMovements
      .filter((sm) => {
        if (!searchValue) return true
        const searchLower = searchValue.toLowerCase()
        return (
          sm.itemDisplayName?.toLowerCase().includes(searchLower) ||
          sm.clerkName?.toLowerCase().includes(searchLower) ||
          sm.act?.toLowerCase().includes(searchLower) ||
          sm.note?.toLowerCase().includes(searchLower)
        )
      })
      .map(
        (sm): LogEntryProps => ({
          type: (sm.act as LogEntryProps['type']) || 'adjustment',
          time: dayjs(sm.dateMoved).format('h:mm A'),
          actor: sm.clerkName || 'Unknown',
          action: sm.act || 'adjustment',
          quantity: Math.abs(sm.quantity),
          item: {
            id: sm.stockId,
            displayName: sm.itemDisplayName || 'Unknown Item',
            // Note: We don't have artist/title in stock movements, could be added later
          },
          metadata: {
            saleId: sm.saleId,
            batchId: sm.batchReceiveId,
            registerName: sm.registerId ? `Register ${sm.registerId}` : undefined,
            note: sm.note,
          },
        }),
      )
      .sort((a, b) => dayjs(b.time, 'h:mm A').valueOf() - dayjs(a.time, 'h:mm A').valueOf())
  }, [stockMovements, searchValue])

  return (
    <LogContainer
      entries={logEntries}
      title="📋 Stock Movement Log"
      showSearch={true}
      onSearch={setSearchValue}
      searchValue={searchValue}
      showFilters={true}
    />
  )
}

export default StockMovementList
